import { ChangeDetectorRef, Component, input, OnInit, ViewEncapsulation } from '@angular/core';
import { NavigatorComponent } from '../components/navigator/navigator.component';
import { FiltersComponent } from '../components/filters/filters.component';
import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AppEnum, ComponentTypeRuEnum } from '../../utils/enum/app.enum';
import { catchError, forkJoin, map, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentOptions } from '../../utils/types/app';
import { DomSanitizer } from '@angular/platform-browser';
import { LoaderComponent } from '../components/loader/loader.component';
import { ApiService1 } from '../../services/api.services1';
import { prioritySchemaMap, props } from '../fetch.config';
import { setCurrentValue, componentStorage, removeCurrentValue, removeRuComponentType } from '../../utils/redux/catalog';
import existInColumnsMin from '../../utils/fnc1/other/exist_in_columns_min';
import existInColumnsMax from '../../utils/fnc1/other/exists_in_columns_max';
import { PageLabelsComponent } from "./page-labels/page-labels.component";
import { isRejected } from '@reduxjs/toolkit';

@Component({
  selector: 'app-catalog',
  imports: [NavigatorComponent, FiltersComponent, NgStyle, HttpClientModule, NgFor, NgClass, LoaderComponent, NgIf, PageLabelsComponent],
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css', '../components/styles/input.css', '../components/styles/button.css', '../components/styles/tabs.css'],
  providers: [ApiService1],
  encapsulation: ViewEncapsulation.None
})



export class CatalogComponent implements OnInit {

  filter: boolean = false
  records: ComponentOptions[] = []
  searchBuffer: ComponentOptions[] = []
  all: ComponentOptions[] = []
  storage: Map<any, any[]> = new Map()
  allias: Map<string, string> = new Map()
  loader!: boolean
  allTableColumns: Map<string, Map<string, string>> = new Map()
  tableColumns: Map<string, string> = new Map()
  dropBoxPropsMapConfig: Map<string, any> = new Map()
  error!: string
  iconName!: 'invalid_file' | 'not_found'
  displayedRuComponentTypes: string[] = []
  selectedKeysValues: [string, string][] = []

  constructor(
    private api: ApiService1,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) { }

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
        componentStorage.dispatch(setCurrentValue([ruComponentType, key, value]))
      }
    })
    this.initComponentStorage()
      .finally(() => {
        this.selectKeyAndValues(ruComponentType)
      })
    this.getApi(query)
  }

  selectKeyAndValues(ruComponentType: string): void {
    console.log(ruComponentType)
    this.selectedKeysValues = []
    const currentValues = componentStorage.getState().currentValues
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
    componentStorage.dispatch(removeRuComponentType([ruComponentType]))
    const currentValues = componentStorage.getState().currentValues
    console.log(currentValues, this.selectedKeysValues, ruComponentType)
    localStorage.setItem('savedFilterValues', JSON.stringify(currentValues))
  }

  initComponentStorage(): Promise<any> {
    const savedFilterValues = localStorage.getItem('savedFilterValues')
    return new Promise<void>((resolve, reject) => {
      try {
        savedFilterValues ? resolve(JSON.parse(savedFilterValues)) : reject()
      } catch (error) {
        reject()
      }
    })
      .then((data: any) => {
        if (typeof data === 'object') {
          for (const ruComponentType in data) {
            for (const key in data[ruComponentType]) {
              componentStorage.dispatch(setCurrentValue([ruComponentType, key, data[ruComponentType][key]]))
            }
          }
        }
        return
      })
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
        const tableColumnsObj = Object.fromEntries(this.tableColumns)
        for (const key in tableColumnsObj) {
          if (payload.has(key)) {
            componentStorage.dispatch(setCurrentValue([ruComponentType, key, payload.get(key) as string]))
          }
          else {
            componentStorage.dispatch(removeCurrentValue([ruComponentType, key]))
          }
        }
      }
      else {
        ruComponentType = AppEnum.ALL
        componentStorage.dispatch(removeRuComponentType([ruComponentType]))
        for (const key in Object.fromEntries(payload)) {
          if (key === 'manufacturerName' || key === 'ruComponentKind') {
            componentStorage.dispatch(setCurrentValue([ruComponentType, key, payload.get(key) as string]))
          }
        }
      }
      const currentValues = componentStorage.getState().currentValues
      console.log(currentValues)
      localStorage.setItem('savedFilterValues', JSON.stringify(currentValues))
      this.selectKeyAndValues(ruComponentType)
      this.searchBuffer = []
      this.resultBuffer = []
      this.all.forEach((item: Partial<ComponentOptions>, index) => {
        let countProp: number = payload.size
        let countMatch: number = 0;
        payload.forEach((value, key) => {
          let val = (item.component as any)[key]
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
              countMatch++
            }
          }
        })
        if (countProp == countMatch) {
          this.searchBuffer.push(item as ComponentOptions)
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
          //  ||
          // key === 'ruComponentKind' && val !== AppEnum.ALL ||
          // key === 'manufacturerName' && val !== AppEnum.ALL
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
      this.records.push(this.searchBuffer[index])
    }
    this.cdr.detectChanges()
  }

  getApi(payload: Map<string, string>): void {
    this.loader = true
    forkJoin([
      this.api.getComponentsApiAll(),
      this.api.getAlias()
    ]).subscribe(res => {
      this.storage.set(ComponentTypeRuEnum.DIOD, (res as any[])[0]["diod"])
      this.storage.set(ComponentTypeRuEnum.TRANSISTOR, (res as any[])[0]["transistor"])
      this.storage.set(ComponentTypeRuEnum.CAPACITOR, (res as any[])[0]["capacitor"])
      this.storage.set(ComponentTypeRuEnum.MICROCHIP, (res as any[])[0]["microchip"])
      this.storage.set(ComponentTypeRuEnum.RESISTOR, (res as any[])[0]["resistor"])
      const allias = (res as any[])[1]
      this.allias = new Map<string, string>(Object.entries(allias))
      if (this.storage.size === 5) {
        this.storage.forEach((set: any) => {
          (set as []).forEach((item: any) => {
            let markup: string = ''
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
            switch (item.ruComponentType) {
              case ComponentTypeRuEnum.MICROCHIP:
                markup = `
                    <p>${allias['ruTechnologyName']}: ${item.ruTechnologyName}</p>
                    <p>${allias['bitDepthValue']}: ${item.bitDepthValue}</p>
                    <p>${allias['minOperatingTemperature']}: ${item.minOperatingTemperature}</p>
                    <p>${allias['maxOperatingTemperature']}: ${item.maxOperatingTemperature}</p>
                    <p>${allias['radiationResistance']}: ${item.radiationResistance}</p>
                  `
                break;
              case ComponentTypeRuEnum.DIOD:
                markup = `
                    <p>${allias['minOperatingTemperature']}: ${item.minOperatingTemperature}</p>
                    <p>${allias['maxOperatingTemperature']}: ${item.maxOperatingTemperature}</p>
                    <p>${allias['radiationResistance']}: ${item.radiationResistance}</p>
                  `
                break;
              case ComponentTypeRuEnum.TRANSISTOR:
                markup = `
                    <p>${allias['minOperatingTemperature']}: ${item.minOperatingTemperature}</p>
                    <p>${allias['maxOperatingTemperature']}: ${item.maxOperatingTemperature}</p>
                    <p>${allias['radiationResistance']}: ${item.radiationResistance}</p>
                  `
                break;
              case ComponentTypeRuEnum.RESISTOR:
                markup = `
                    <p>${allias['minOperatingTemperature']}: ${item.minOperatingTemperature}</p>
                    <p>${allias['maxOperatingTemperature']}: ${item.maxOperatingTemperature}</p>
                    <p>${allias['radiationResistance']}: ${item.radiationResistance}</p>
                  `
                break;
              case ComponentTypeRuEnum.CAPACITOR:
                markup = `
                    <p>${allias['minOperatingTemperature']}: ${item.minOperatingTemperature}</p>
                    <p>${allias['maxOperatingTemperature']}: ${item.maxOperatingTemperature}</p>
                    <p>${allias['maxCapacity']}: ${item.maxCapacity}</p>                   
                    <p>${allias['minCapacity']}: ${item.minCapacity}</p>
                  `
                break;
            }

            if (actualPayload.size == satisfyCount) {
              this.searchBuffer.push({
                component: item,
                html: this.sanitizer.bypassSecurityTrustHtml(markup),
              })
            }
            this.all.push({
              component: item,
              html: this.sanitizer.bypassSecurityTrustHtml(markup),
            })
            if (!this.allTableColumns.get(item.ruComponentType)) {
              let columns = prioritySchemaMap.get(item.ruComponentType)! as string[]
              this.allTableColumns.set(item.ruComponentType, new Map(columns.map((value) => [value, this.allias.get(value) as string])))
            }
          })
        })
        let ruComponentType = payload.get('ruComponentType')
        if (ruComponentType) {
          this.tableColumns = this.allTableColumns.get(ruComponentType)!
        }
        this.displayedRuComponentTypes = Array.from(this.storage.keys())
        this.resultBuffer = Array.from(this.searchBuffer);
      }
      this.loader = false
    });
  }

  onTypeChanged(ruComponentType: string): void {
    let exceptions = new Map()
    let currentValues: any = componentStorage.getState().currentValues
    this.resultBuffer = [...this.resultBuffer]
    this.tableColumns = new Map()
    if (ruComponentType !== AppEnum.ALL) {
      this.tableColumns = this.allTableColumns.get(ruComponentType)!
      for (const componentType in currentValues) {
        if (ruComponentType.toLocaleLowerCase() === componentType.toLocaleLowerCase()) {
          for (const key in currentValues[componentType]) {
            if (this.tableColumns.has(key)) {
              exceptions.set(key, { currentValue: currentValues[componentType][key] })
            }
          }
        }
      }
    }
    else {
      const currentValues = (componentStorage.getState().currentValues as any)[AppEnum.ALL]
      for (const key in currentValues) {
        exceptions.set(key, { currentValue: currentValues[key] })
      }
    }

    this.initDropBoxMapConfig(
      exceptions
      // .set('manufacturerName', this.dropBoxPropsMapConfig.get('manufacturerName'))
      // .set('ruComponentKind', this.dropBoxPropsMapConfig.get('ruComponentKind'))
    );
    console.log()
    this.dropBoxPropsMapConfig.get('ruComponentType').currentValue = ruComponentType
    let map = this.getSimpleKeyValueMap()
    console.log(map)
    this.setQuery(map, 'replace').then((res) => {
      this.apply(res)
      console.log(this.dropBoxPropsMapConfig)
    })
  }

  openComponentInfo(item: ComponentOptions): void {
    this.router.navigateByUrl(`component?ruComponentType=${item.component.ruComponentType}&&componentName=${item.component.componentName}`)
  }

  getPdfUrl(item: any): string | null {
    return !item.component.remark1 ? null : `http://localhost:5000/datasheets/${item.component.remark1}.pdf`
  }
  resultBuffer: ComponentOptions[] = []
  search(event: any): void {
    let value: string = event.target.value
    this.records = []
    this.resultBuffer = []
    this.searchBuffer.forEach((item: ComponentOptions) => {
      if (this.include(item, value)) {
        this.resultBuffer.push(item)
      }
    })
    this.setQuery(new Map().set('page', 0), 'merge').then(() => {
      this.selectPage(0)
    })
  }

  include(item: ComponentOptions, value: string): boolean {
    let componentName: string = item.component.componentName
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