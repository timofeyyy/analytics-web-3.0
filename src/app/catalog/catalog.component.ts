import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NavigatorComponent } from '../components/navigator/navigator.component';
import { FiltersComponent } from '../components/filters/filters.component';
import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AppEnum } from '../../utils/enum/app.enum';
import { forkJoin, } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { LoaderComponent } from '../components/loader/loader.component';
import { ApiService } from '../../services/api.services1';
import { props } from '../fetch.config';
import { setCurrentValue, catalogStorage, removeCurrentValue, removeRuComponentType } from '../../utils/redux/catalog';
import { PageLabelsComponent } from "./page-labels/page-labels.component";
import { existInColumnsMax, existInColumnsMin } from '../../utils/static-data/compared-min-max';
import { isException } from '../../utils/static-data/filter-exceptions';
import { componentStorage, setComponentSchema, initComponentTypes } from '../../utils/redux/component';
// import { ComponentInitializator } from '../../utils/initializators/componentInitilizator';

@Component({
  selector: 'app-catalog',
  imports: [NavigatorComponent, FiltersComponent, NgStyle, HttpClientModule, NgFor, NgClass, LoaderComponent, NgIf, PageLabelsComponent],
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css', '../components/styles/input.css', '../components/styles/button.css', '../components/styles/categories.css', '../components/styles/tabs.css'],
  providers: [ApiService],
  encapsulation: ViewEncapsulation.None
})



export class CatalogComponent implements OnInit {
  previewColumnCount: number = 4
  filter: boolean = false
  records: any[] = []
  searchBuffer: any[] = []
  all: any[] = []
  storage: Map<any, any[]> = new Map()
  alias: Map<string, string> = new Map()
  loader!: boolean
  columns: string[] = []
  componentTypes: any[] = []
  dropBoxPropsMapConfig: Map<string, any> = new Map()
  selectedKeysValues: [string, string][] = []

  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    const query: Map<string, string> = new Map(Object.entries((this.route.snapshot.queryParamMap as any).params))
    const exceptions: Map<string, { currentValue: string }> = new Map(Object.entries((this.route.snapshot.queryParamMap as any).params).map((value: [string, unknown]) => {
      return [value[0], { currentValue: value[1] as string }]
    }))
    this.initDropBoxMapConfig(exceptions);
    let ruComponentType: string | undefined = query.get('ruComponentType')
    if (!ruComponentType) {
      ruComponentType = AppEnum.ALL
    }
    query.forEach((value, key) => {
      if (this.dropBoxPropsMapConfig.has(key) && key !== 'ruComponentType') {
        catalogStorage.dispatch(setCurrentValue([ruComponentType, key, value]))
      }
    })
    this.api.getComponentNames()?.subscribe(res => {
      this.componentTypes = res
    })
    this.initComponentStorage()
    this.selectKeyAndValues(ruComponentType)
    this.getApi(query)
  }

  selectKeyAndValues(ruComponentType: string): void {
    this.selectedKeysValues = []
    const currentValues = catalogStorage.getState().currentValues
    for (const _ruComponentType in currentValues) {
      if (_ruComponentType.toLowerCase() === ruComponentType.toLowerCase()) {
        for (const key in (currentValues as any)[_ruComponentType]) {
          this.selectedKeysValues.push([key, (currentValues as any)[_ruComponentType][key]])
        }
      }
    }
  }

  resetKeyAndValues(ruComponentType: string): void {
    this.selectedKeysValues = []
    catalogStorage.dispatch(removeRuComponentType([ruComponentType]))
    const currentValues = catalogStorage.getState().currentValues
    localStorage.setItem('savedFilterValues', JSON.stringify(currentValues))
  }

  initComponentStorage(): void {
    const savedFilterValues = JSON.parse(localStorage.getItem('savedFilterValues')!)
    if (typeof savedFilterValues === 'object') {
      for (const ruComponentType in savedFilterValues) {
        for (const key in savedFilterValues[ruComponentType]) {
          catalogStorage.dispatch(setCurrentValue([ruComponentType, key, savedFilterValues[ruComponentType][key]]))
        }
      }
    }
  }

  initDropBoxMapConfig(exceptions: Map<string, { currentValue: string }> | void): void {
    const dropBoxPropsClone: any = {};
    const propsObj = Object.entries(props)
    for (const [key, value] of propsObj) {
      dropBoxPropsClone[key] = (exceptions && exceptions.get(key)) ? exceptions.get(key) : { currentValue: AppEnum.ALL };
      dropBoxPropsClone[key].input = false
      if ((value as any).sort) {
        dropBoxPropsClone[key].sort = (value as any).sort

      }
    }
    this.dropBoxPropsMapConfig = new Map(Object.entries(dropBoxPropsClone));
  }

  setQuery(query: Map<string, string>, queryParamsHandlingState: 'replace' | 'merge'): Promise<Map<string, string>> {
    const querysearchBuffer: Map<string, string | null> = query
    if (querysearchBuffer.get('ruComponentType') === AppEnum.ALL) {
      querysearchBuffer.set('ruComponentType', null)
    }
    return this.router.navigate([], {
      relativeTo: this.route,
      queryParams: Object.fromEntries(querysearchBuffer),
      queryParamsHandling: queryParamsHandlingState,
      skipLocationChange: false,
    }).then(() => {
      if (querysearchBuffer.get('ruComponentType') === null) {
        querysearchBuffer.delete('ruComponentType')
      }
      return querysearchBuffer as Map<string, string>
    });
  }

  apply(payload: Map<string, string>): void {
    if (payload) {
      let ruComponentType: string | undefined = payload.get('ruComponentType')
      if (ruComponentType) {
        const columns = ['manufacturerName', 'ruComponentKind', ...this.columns]
        for (const col of columns) {
          if (payload.has(col)) {
            catalogStorage.dispatch(setCurrentValue([ruComponentType, col, payload.get(col) as string]))
          }
          else {
            catalogStorage.dispatch(removeCurrentValue([ruComponentType, col]))
          }
        }
      }
      else {
        ruComponentType = AppEnum.ALL
        catalogStorage.dispatch(removeRuComponentType([ruComponentType]))
        for (const key in Object.fromEntries(payload)) {
          if (key === 'manufacturerName' || key === 'ruComponentKind') {
            catalogStorage.dispatch(setCurrentValue([ruComponentType, key, payload.get(key) as string]))
          }
        }
      }
      const currentValues = catalogStorage.getState().currentValues
      localStorage.setItem('savedFilterValues', JSON.stringify(currentValues))
      this.selectKeyAndValues(ruComponentType)
      this.searchBuffer = []
      this.resultBuffer = []
      this.all.forEach((item: any, index) => {
        let countProp: number = payload.size
        let countMatch: number = 0;
        payload.forEach((value, key) => {
          let val = (item as any)[key]
          if (val !== undefined) {
            if (
              (val == value || value == AppEnum.ALL) ||
              (val == null && (value == null || value == "null"))
              ||
              (existInColumnsMin(key) && !isNaN(Number(value)) && val >= Number(value)) ||
              (existInColumnsMax(key) && !isNaN(Number(value)) && val <= value) ||
              (val == value) ||
              (val == Number(value))
            ) {
              countMatch++
            }
          }
        })
        if (countProp == countMatch) {
          this.searchBuffer.push(item)
        }
      })
      this.resultBuffer = Array.from(this.searchBuffer);
      this.setQuery(new Map().set('page', 0), 'merge').then(() => {
        this.selectPage(0)
      })
    }
    this.filter = false
  }

  getSimpleKeyValueMap(): Map<string, string> {
    const map: Map<string, string> = new Map()
    const object = Object.fromEntries(this.dropBoxPropsMapConfig)
    for (const key in object) {
      let val = object[key].currentValue
      if (
        val && (
          (object[key].input === false && val !== AppEnum.ALL && val) ||
          (object[key].input && val) ||
          key === 'ruComponentType'
        )
      ) {
        map.set(key, val)
      }
    }
    return map
  }

  selectPage(currentPage: number): void {
    this.records = []
    for (let index = (currentPage) * 20; index < (currentPage + 1) * 20 && index < this.resultBuffer.length; index++) {
      this.records.push(this.resultBuffer[index])
    }
    this.cdr.detectChanges()
  }

  getApi(payload: Map<string, string>): void {
    this.loader = true
    forkJoin([
      this.api.getComponentsApiAll(),
      this.api.getAlias()
    ]).subscribe(res => {
      this.storage = new Map(Object.entries(res[0] as any))
      componentStorage.dispatch(setComponentSchema(res[0]))
      const alias = (res as any[])[1]
      this.alias = new Map<string, string>(Object.entries(alias))
      if (this.storage.size === 5) {
        const storageObj = Object.fromEntries(this.storage)
        for (const key in storageObj) {
          (storageObj[key] as []).forEach((item: any) => {
            let satisfyCount: number = 0;
            const actualPayload = payload
            actualPayload.delete('page')
            payload.forEach((value, key) => {
              let val = (item as any)[key]
              if (val !== undefined) {
                if (
                  (val == value || value == AppEnum.ALL) ||
                  (val == null && (value == null || value == "null"))
                  ||
                  // (val == null && queryObject[key].replace(AppEnum.NOTDEFINED, null) == `${obj[key]}`) ||
                  // (obj[key] == '' && queryObject[key].replace(AppEnum.NOTDEFINED, "") == `${obj[key]}`) ||
                  (existInColumnsMin(key) && !isNaN(Number(value)) && val >= Number(value)) ||
                  (existInColumnsMax(key) && !isNaN(Number(value)) && val <= value) ||
                  (val == value) ||
                  (val == Number(value))
                ) {
                  satisfyCount++
                }
              }
            })
            if (actualPayload.size == satisfyCount) {
              this.searchBuffer.push(item)
            }
            this.all.push(item)
          })
        }
        let ruComponentType = payload.get('ruComponentType')
        if (ruComponentType) {
          this.columns = this.getTabelColumns(ruComponentType)
        }
        this.resultBuffer = Array.from(this.searchBuffer);
      }
      this.loader = false
    });
  }

  getHtmlPreview(item: any): any {
    let markup: string = ""
    let objIterator = 0
    for (const key in item) {
      if (objIterator < this.previewColumnCount && !isException(key)) {
        markup += `<p>${this.alias.get(key)}: ${item[key]}</p>`
        objIterator++
      }
    }
    return this.sanitizer.bypassSecurityTrustHtml(markup)
  }

  getTabelColumns(ruComponentType: string): string[] {
    const schema: Map<string, string[]> = new Map(Object.entries(componentStorage.getState().componentSchema as []))
    return schema.get(ruComponentType)!
  }

  onTypeChanged(ruComponentType: string): void {
    let exceptions = new Map()
    let currentValues: any = catalogStorage.getState().currentValues
    this.resultBuffer = [...this.resultBuffer]
    if (ruComponentType === AppEnum.ALL) {
      this.columns = []
      exceptions
        .set('manufacturerName', { currentValue: currentValues[AppEnum.ALL] && currentValues[AppEnum.ALL].manufacturerName ? currentValues[AppEnum.ALL].manufacturerName : AppEnum.ALL })
        .set('ruComponentKind', { currentValue: currentValues[AppEnum.ALL] && currentValues[AppEnum.ALL].ruComponentKind ? currentValues[AppEnum.ALL].ruComponentKind : AppEnum.ALL })
    }
    else {
      this.columns = this.getTabelColumns(ruComponentType)
      const columns = ['manufacturerName', 'ruComponentKind', ...this.columns]

      for (const componentType in currentValues) {
        if (ruComponentType.toLocaleLowerCase() === componentType.toLocaleLowerCase()) {
          for (const key in currentValues[componentType]) {
            const column = columns.find((val: string) => val == key)
            if (column) {
              exceptions.set(key, { currentValue: currentValues[componentType][key] })
            }
          }
        }
      }
    }
    this.initDropBoxMapConfig(
      exceptions
    );
    this.dropBoxPropsMapConfig.get('ruComponentType').currentValue = ruComponentType
    let map = this.getSimpleKeyValueMap()
    this.setQuery(map, 'replace').then((res) => {
      this.apply(res)
    })
  }

  openComponentInfo(item: any): void {
    this.router.navigateByUrl(`component?ruComponentType=${item.ruComponentType}&&componentName=${item.componentName}`)
  }

  getPdfUrl(item: any): string | null {
    // ${this.api.getApiAdress()}
    return !item.remark1 ? null : `/datasheets/${item.remark1}.pdf`
  }
  resultBuffer: any[] = []
  search(event: any): void {
    let value: string = event.target.value
    this.resultBuffer = []
    this.searchBuffer.forEach((item: any) => {
      if (this.include(item, value)) {
        this.resultBuffer.push(item)
      }
    })
    this.setQuery(new Map().set('page', 0), 'merge').then(() => {
      this.selectPage(0)
    })
  }

  include(item: any, value: string): boolean {
    let componentName: string = item.componentName
    let length: number = componentName.length >= value.length ? value.length : componentName.length
    let extractedPart = componentName.slice(0, length).split('')
    for (let i = 0; i < extractedPart.length; i++) {
      if (value[i].toLocaleLowerCase() !== extractedPart[i].toLocaleLowerCase()) {
        return false;
      }
    }
    return true;
  }
}