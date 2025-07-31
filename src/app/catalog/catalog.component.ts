import { Component, input, OnInit, ViewEncapsulation } from '@angular/core';
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
import { setCurrentValue, store } from '../../utils/redux/storage';
import existInColumnsMin from '../../utils/fnc1/other/existInColumnsMin';
import existInColumnsMax from '../../utils/fnc1/other/existsInColumnsMax';

@Component({
  selector: 'app-catalog',
  imports: [NavigatorComponent, FiltersComponent, NgStyle, HttpClientModule, NgFor, NgClass, LoaderComponent, NgIf],
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css', '../components/styles/input.css', '../components/styles/button.css', '../components/styles/tabs.css'],
  providers: [ApiService1],
  encapsulation: ViewEncapsulation.None
})



export class CatalogComponent implements OnInit {

  filter: boolean = false
  records: ComponentOptions[] = []
  // orig: ComponentOptions[] = []
  searchBuffer: ComponentOptions[] = []
  all: ComponentOptions[] = []
  storage: Map<any, any[]> = new Map()
  allias: Map<string, string> = new Map()
  pages: number[] = []
  from: number = 0
  to: number = 1
  currentPage: number = 0
  last: number = 1
  loader!: boolean
  allTableColumns: Map<string, Map<string, string>> = new Map()
  tableColumns: Map<string, string> = new Map()
  dropBoxPropsMapConfig: Map<string, any> = new Map()
  error!: string
  iconName!: 'invalid_file' | 'not_found'
  displayedRuComponentTypes: string[] = []


  constructor(
    private api: ApiService1,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {



    const query: Map<string, string> = new Map(Object.entries((this.route.snapshot.queryParamMap as any).params))
    this.initDropBoxMapConfig();

    query.forEach((value, key) => {
      if (this.dropBoxPropsMapConfig.get(key)) {
        this.dropBoxPropsMapConfig.get(key).currentValue = value
        store.dispatch(setCurrentValue([key, value]))
        // console.log(store.getState().currentValues)
        //frequency=100&ruComponentType=Микросхема&page=0
      }
    })
    this.getApi(query)
  }

  initDropBoxMapConfig(exceptions: Map<string, any> | void): void {
    const dropBoxPropsClone: any = {};
    for (const [key, value] of Object.entries(props)) {
      dropBoxPropsClone[key] = (exceptions && exceptions.get(key)) ? exceptions.get(key) : { currentValue: AppEnum.ALL, input: false };
    }
    this.dropBoxPropsMapConfig = new Map(Object.entries(dropBoxPropsClone));
  }

  setQuery(query: Map<string, string>, queryParamsHandlingState: 'replace' | 'merge'): Promise<Map<string, string>> {
    const querysearchBuffer: Map<string, string | null> = query
    if (querysearchBuffer.get('ruComponentType') === AppEnum.ALL) {
      querysearchBuffer.set('ruComponentType', null)
    }
    // console.log(Object.fromEntries(querysearchBuffer))
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
      Array.from(payload).forEach((column: [string, string]) => {
        if (column[0] != 'ruComponentType') {
          store.dispatch(setCurrentValue(column))
        }
      })
      this.searchBuffer = []
      // console.log(this.all)
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
      this.changeCurrentPage(0)
      this.from = 0
      this.last = Math.ceil(this.searchBuffer.length / 20) === 0 ? 0 : Math.ceil(this.searchBuffer.length / 20) - 1
      this.to = this.searchBuffer.length / 20 <= 10 ? Math.ceil(this.searchBuffer.length / 20) : 10
      this.updatePages()
      this.selectPage()
    }
    this.filter = false
  }

  getSimpleKeyValueMap(): Map<string, string> {
    const map: Map<string, string> = new Map()
    const object = Object.fromEntries(this.dropBoxPropsMapConfig)
    for (const key in object) {
      let val = object[key].currentValue
      if ((object[key].input === false && val !== AppEnum.ALL && val) || (object[key].input && val)) {
        map.set(key, val)
      }
      if (key === 'ruComponentType' && val) {
        map.set(key, val)
      }
      if (key === 'ruComponentKind' && val !== AppEnum.ALL && val) {
        map.set(key, val)
      }
      if (key === 'manufacturerName' && val !== AppEnum.ALL && val) {
        map.set(key, val)
      }
    }
    return map
  }


  getApi(payload: Map<string, string>): void {
    this.loader = true
    forkJoin([
      // this.api.getDiods(),
      // this.api.getTransistors(),
      // this.api.getCapacitors(),
      // this.api.getMicrochips(),
      // this.api.getResistors(),
      this.api.getComponentsApiAll(),
      this.api.getAlias()
    ]).subscribe(res => {
      this.storage.set(ComponentTypeRuEnum.DIOD, (res as any[])[0]["diods"])
      this.storage.set(ComponentTypeRuEnum.TRANSISTOR, (res as any[])[0]["transistors"])
      this.storage.set(ComponentTypeRuEnum.CAPACITOR, (res as any[])[0]["capacitors"])
      this.storage.set(ComponentTypeRuEnum.MICROCHIP, (res as any[])[0]["microchips"])
      this.storage.set(ComponentTypeRuEnum.RESISTOR, (res as any[])[0]["resistors"])
      const allias = (res as any[])[1]
      this.allias = new Map<string, string>(Object.entries(allias))
      if (this.storage.size === 5) {
        this.storage.forEach((set: any) => {
          (set as []).forEach((item: any) => {
            let markup: string = ''
            let filters: string[] = []
            let satisfyCount: number = 0;
            // payload.forEach((value, key) => {
            //   if (item[key] && (item[key] == value || value == AppEnum.ALL) || key === 'page') {
            //     satisfyCount++;
            //   }
            // })
            const actualPayload = payload
            actualPayload.delete('page')
            payload.forEach((value, key) => {
              let val = (item as any)[key]
              if (val !== undefined) {
                // console.log([
                //   (val == value || value == AppEnum.ALL),
                //   (val == null && (value == null || value == "null")),
                //   (existInColumnsMin(key) && !isNaN(Number(value)) && val >= Number(value)),
                //   (existInColumnsMax(key) && !isNaN(Number(value)) && val <= value),
                //   (val == value),
                //   (val == Number(value)),
                //   key,
                //   value,
                //   val
                // ])
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
                filters: filters,
              })
            }
            this.all.push({
              component: item,
              html: this.sanitizer.bypassSecurityTrustHtml(markup),
              filters: filters,
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
        this.from = 0
        this.last = Math.ceil(this.searchBuffer.length / 20) === 0 ? 0 : Math.ceil(this.searchBuffer.length / 20) - 1
        if (payload.get('page')) {
          if (!isNaN(parseInt(payload.get('page') as string))) {
            const value = parseInt(payload.get('page') as string)
            if (Math.ceil(this.searchBuffer.length / 20) < value) {
              this.error = "Ничего не найдено"
              this.iconName = "not_found"
            }
            else {
              const rest = value % 10
              this.from = value - rest
              const n = 10 - rest
              this.to = value + n
              if (this.to >= this.last) {
                this.to = this.last + 1
              }
              this.changeCurrentPage(value)
            }
          }
          else {
            this.error = "Некорректный формат страницы"
            this.iconName = "invalid_file"
          }
        }
        else {
          this.to = this.searchBuffer.length / 20 <= 10 ? Math.ceil(this.searchBuffer.length / 20) : 10
        }

        this.selectPage()
        this.updatePages()
      }

      this.loader = false
    });
  }

  onTypeSelected(ruComponentType: string): void {
    let exceptions
    let currentValues: any = store.getState().currentValues
    // console.log(currentValues)
    if (ruComponentType === AppEnum.ALL) {
      this.tableColumns = new Map()
    }
    else {
      this.tableColumns = this.allTableColumns.get(ruComponentType)!
      exceptions = new Map()
        .set('manufacturerName', this.dropBoxPropsMapConfig.get('manufacturerName'))
        .set('ruComponentKind', this.dropBoxPropsMapConfig.get('ruComponentKind'))

    }

    this.initDropBoxMapConfig(exceptions);
    // console.log(this.tableColumns)
    for (const key in currentValues) {
      if (this.tableColumns.has(key)) {
        this.dropBoxPropsMapConfig.get(key)!.currentValue = currentValues[key]
        // exceptions.set(key, currentValues[key])
      }
    }
    this.dropBoxPropsMapConfig.get('ruComponentType').currentValue = ruComponentType
    // console.log(this.dropBoxPropsMapConfig)
    let map = this.getSimpleKeyValueMap()
    // let query = map
    // if(exceptions) {
    //   query = {...query, ...Object.fromEntries(exceptions) }
    // }
    // console.log(query)
    // if (exceptions) {
    //   for (const key in currentValues) {
    //   }
    // }
    // console.log(map)
    this.setQuery(map, 'replace').then((res) => {
      this.apply(res)
    })
  }

  openComponentInfo(item: ComponentOptions): void {
    this.router.navigateByUrl(`component?ruComponentType=${item.component.ruComponentType}&&componentName=${item.component.componentName}`)
  }

  changeCurrentPage(value: number): void {
    this.currentPage = value
    this.setQuery(new Map().set('page', value), 'merge')
  }

  updatePages(): void {
    this.pages = []
    for (let i = this.from; i < this.to; i++) {
      this.pages.push(i)
    }
  }

  selectPage(): void {
    this.records = []
    this.searchBuffer.forEach((item: ComponentOptions, index: number) => {
      if (index >= (this.currentPage) * 20 && index < (this.currentPage + 1) * 20) {
        this.records.push(item)
      }
    })
  }

  prev(): void {
    if (this.currentPage > 0) {
      this.changeCurrentPage(this.currentPage - 1)
      if (this.currentPage !== 0 && (this.currentPage + 1) % 10 === 0) {
        this.from -= 10
        if (this.to % 10 === 0) {
          this.to -= 10
        }
        else {
          this.to = this.to - (this.to % 10)
        }
        this.updatePages()
      }
      this.selectPage()
    }
  }

  next(): void {
    if (this.currentPage < this.last) {
      this.changeCurrentPage(this.currentPage + 1)
      if (this.currentPage % 10 === 0) {
        this.from += 10
        this.to = this.to + 10 > this.last ? this.last + 1 : this.to + 10
        this.updatePages()
      }
      this.selectPage()
    }
  }

  getLatest(): void {
    this.from = this.last - this.last % 10
    this.to = this.last + 1
    this.changeCurrentPage(this.last)
    this.updatePages()
    this.selectPage()
  }

  nextSet(): void {
    if (this.to <= this.last) {
      this.from += 10
      this.to = this.to + 10 > this.last ? this.last + 1 : this.to + 10
      this.changeCurrentPage(this.from)
      this.updatePages()
      this.selectPage()
    }
  }

  prevSet(): void {
    if (this.from != 0) {
      this.from -= 10
      if (this.to % 10 === 0) {
        this.to -= 10
      }
      else {
        this.to = this.to - (this.to % 10)
      }
      this.changeCurrentPage(this.from)
      this.updatePages()
      this.selectPage()
    }
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
    this.from = 0
    this.changeCurrentPage(0)
    this.last = Math.ceil(this.searchBuffer.length / 20) - 1
    this.to = this.searchBuffer.length / 20 <= 10 ? Math.ceil(this.searchBuffer.length / 20) : 10
    this.updatePages()
    this.selectPage()
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