import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NavigatorComponent } from '../components/navigator/navigator.component';
import { FiltersComponent } from '../components/filters/filters.component';
import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AppEnum } from '../../utils/enum/app.enum';
import { concatMap, forkJoin, } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { LoaderComponent } from '../components/loader/loader.component';
import { ApiService } from '../../services/api.services';
import { setCurrentValue, catalogStorage, removeCurrentValue, removeRuComponentType } from '../../utils/redux/catalog';
import { PageLabelsComponent } from "./page-labels/page-labels.component";
import { existInColumnsMax, existInColumnsMin } from '../../utils/static-data/compared-min-max';
import { isException } from '../../utils/static-data/filter-exceptions';
import { componentStorage, setComponentSchema } from '../../utils/redux/component';
import { ComponentTypes } from '../../utils/types/app';
import { ComponentTypeService } from '../../services/component-type.service';
import { sortObjMap } from '../fetch.config';
// import { ComponentInitializator } from '../../utils/initializators/componentInitilizator';

@Component({
  selector: 'app-catalog',
  imports: [NavigatorComponent, FiltersComponent, NgStyle, HttpClientModule, NgFor, NgClass, LoaderComponent, NgIf, PageLabelsComponent],
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css', '../components/styles/input.css', '../components/styles/button.css', '../components/styles/categories.css'],
  providers: [ApiService, ComponentTypeService],
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
  // componentTypes: any[] = []
  dropBoxPropsMapConfig: Map<string, any> = new Map()
  selectedKeysValues: [string, string][] = []

  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private cts: ComponentTypeService
  ) { }
  getComponentTypes(): ComponentTypes[] {
    return this.cts.getComponentTypes()
  }
  // alLcolumns: {}
  ngOnInit(): void {
    this.api.getAlias().pipe(
      concatMap((alias: { [type: string]: string }) => {
        this.alias = new Map<string, string>(Object.entries(alias))
        return this.api.getColumns()
      }),
      concatMap((alLcolumns: any) => {
        // this.alLcolumns = alLcolumns
        this.cts.setColumnsAll(alLcolumns)
        return this.api.getComponentNames()
      }),
    )
      .subscribe((componentTypes: ComponentTypes[]) => {
        this.cts.setComponentTypes(componentTypes)
        // this.alias = new Map<string, string>(Object.entries(alias))
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
        const currentComponentType = this.cts.getComponentTypeByRu(ruComponentType)
        this.cts.setCurrentComponentType(currentComponentType!)
        // this.api.getComponentNames()?.subscribe(res => {
        //   this.componentTypes = res
        // })
        this.initComponentStorage()
        this.selectKeyAndValues(ruComponentType)
        this.getApi(query)
      })
  }

  selectKeyAndValues(ruComponentType: string): void {
    this.selectedKeysValues = []
    const currentValues = catalogStorage.getState().currentValues
    // console.log(ruComponentType, currentValues)
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
    for (const [key, value] of this.alias.entries()) {
      dropBoxPropsClone[key] = (exceptions && exceptions.get(key)) ? exceptions.get(key) : { currentValue: AppEnum.ALL };
      dropBoxPropsClone[key].input = false
      for (const sKey of sortObjMap.keys()) {
        if (key == sKey) {
          dropBoxPropsClone[key].sort = sortObjMap.get(sKey)
        }
      }
      // if ((value as any).sort) {
      //   dropBoxPropsClone[key].sort = (value as any).sort
      // }
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
          // console.log(payload.has(col), columns, payload)
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
      for (const key of this.storage.keys()) {
        const componentType = this.cts.getComponentTypeByEn(key)
        const all: any[] = this.storage.get(key)!
        if (this.cts.getComponentTypeByEn(key)?.ruComponentType != ruComponentType && ruComponentType != AppEnum.ALL) {
          continue
        }
        all.forEach((item: any, index) => {
          payload.delete('ruComponentType')
          payload.delete('enComponentType')
          let countProp: number = payload.size
          let countMatch: number = 0;
          item['ruComponentType'] = componentType?.ruComponentType
          payload.forEach((value, key) => {
            let val = (item as any)[key]
            if (val !== undefined) {
              if (
                (val == value || value == AppEnum.ALL) ||
                (val == null && (value == null || value == "null"))
                ||
                // (existInColumnsMin(key) && !isNaN(Number(value)) && val >= Number(value)) ||
                // (existInColumnsMax(key) && !isNaN(Number(value)) && val <= value) ||
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
      }


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
    this.api.getComponentsApiAll()
      .subscribe((res: any) => {
        this.storage = new Map(Object.entries(res))
        componentStorage.dispatch(setComponentSchema(res))
        const storageObj = Object.fromEntries(this.storage)
        const currentComponentType = this.cts.getCurrentComponentType()
        for (const key in storageObj) {
          const componentType = this.cts.getComponentTypeByEn(key);
          if (currentComponentType && componentType!.ruComponentType.toLowerCase() != currentComponentType.ruComponentType.toLowerCase()) {
            continue
          }
          (storageObj[key] as []).forEach((item: any) => {
            payload.delete('ruComponentType')
            payload.delete('enComponentType')
            let satisfyCount: number = 0;
            const actualPayload = payload
            actualPayload.delete('page')
            item['ruComponentType'] = componentType?.ruComponentType

            payload.forEach((value, key) => {
              let val = (item as any)[key]
              if (val !== undefined) {
                if (
                  (val == value || value == AppEnum.ALL) ||
                  (val == null && (value == null || value == "null"))
                  ||
                  // (val == null && queryObject[key].replace(AppEnum.NOTDEFINED, null) == `${obj[key]}`) ||
                  // (obj[key] == '' && queryObject[key].replace(AppEnum.NOTDEFINED, "") == `${obj[key]}`) ||
                  // (existInColumnsMin(key) && !isNaN(Number(value)) && val >= Number(value)) ||
                  // (existInColumnsMax(key) && !isNaN(Number(value)) && val <= value) ||
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
    // console.log(ruComponentType)
    const componentType = this.cts.getComponentTypeByRu(ruComponentType)
    const schema: Map<string, string[]> = new Map(Object.entries(componentStorage.getState().componentSchema as []))
    return schema.get(componentType!.enComponentType.toLowerCase())!
  }
  onTypeChangedUpdate(ruComponentType: string): void {
    const componentType = this.cts.getComponentTypeByRu(ruComponentType)
    // console.log(ruComponentType, componentType)
    if (componentType) {
      this.onTypeChanged(componentType!)
    }
    else {
      this.onTypeChanged({ ruComponentType: AppEnum.ALL, enComponentType: AppEnum.ALL })
    }
  }
  onTypeChanged(componentType: ComponentTypes): void {
    // console.log(componentType)
    let exceptions = new Map()
    let currentValues: any = catalogStorage.getState().currentValues
    this.resultBuffer = [...this.resultBuffer]
    if (componentType.ruComponentType === AppEnum.ALL) {
      this.columns = []
      exceptions
        .set('manufacturerName', { currentValue: currentValues[AppEnum.ALL] && currentValues[AppEnum.ALL].manufacturerName ? currentValues[AppEnum.ALL].manufacturerName : AppEnum.ALL })
        .set('ruComponentKind', { currentValue: currentValues[AppEnum.ALL] && currentValues[AppEnum.ALL].ruComponentKind ? currentValues[AppEnum.ALL].ruComponentKind : AppEnum.ALL })
    }
    else {
      this.columns = this.getTabelColumns(componentType.ruComponentType)
      const columns = ['manufacturerName', 'ruComponentKind', ...this.columns]

      for (const componentType1 in currentValues) {
        if (componentType.ruComponentType.toLocaleLowerCase() === componentType1.toLocaleLowerCase()) {
          for (const key in currentValues[componentType1]) {
            const column = columns.find((val: string) => val == key)
            if (column) {
              exceptions.set(key, { currentValue: currentValues[componentType1][key] })
            }
          }
        }
      }
    }
    this.initDropBoxMapConfig(
      exceptions
    );
    this.dropBoxPropsMapConfig.get('ruComponentType').currentValue = componentType.ruComponentType
    let map = this.getSimpleKeyValueMap()
    // console.log(map)
    this.setQuery(map, 'replace').then((res) => {
      // console.log(res)
      this.apply(res)
    })
  }

  openComponentInfo(item: any): void {
    const componentType = this.cts.getComponentTypeByRu(item.ruComponentType)
    this.router.navigateByUrl(`component?enComponentType=${componentType?.enComponentType}&id=${item.id}`)
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