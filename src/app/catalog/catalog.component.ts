import { Component, OnInit, ViewEncapsulation } from '@angular/core';
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
import { props } from '../../assets/fetch.config';

@Component({
  selector: 'app-catalog',
  imports: [NavigatorComponent, FiltersComponent, NgStyle, HttpClientModule, NgFor, NgClass, LoaderComponent, NgIf],
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css', '../components/selection/selection.css', '../components/styles/button.css', '../components/styles/tabs.css'],
  providers: [ApiService1],
  encapsulation: ViewEncapsulation.None
})



export class CatalogComponent implements OnInit {

  filter!: boolean
  records!: ComponentOptions[]
  orig!: ComponentOptions[]
  copy!: ComponentOptions[]
  all!: ComponentOptions[]
  storage!: Map<any, any[]>
  allias!: Map<string, string>
  pages!: number[]
  from!: number
  to!: number
  currentPage!: number
  last!: number
  loader!: boolean
  allTableColumns!: Map<string, Map<string, string>>
  tableColumns!: Map<string, string>
  dropBoxPropsMapConfig!: Map<string, any>
  error!: string
  iconName!: 'invalid_file' | 'not_found'
  displayedRuComponentTypes!: string[]


  constructor(
    private api: ApiService1,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    const query: Map<string, string> = new Map(Object.entries((this.route.snapshot.queryParamMap as any).params))
    this.loader = true
    this.filter = false
    this.records = []
    this.orig = []
    this.all = []
    this.copy = []
    this.pages = []
    this.displayedRuComponentTypes = []
    this.to = 1
    this.from = 0
    this.currentPage = 0
    this.last = 1
    this.storage = new Map()
    this.allias = new Map()
    this.tableColumns = new Map()
    this.allTableColumns = new Map()
    const dropBoxPropsClone: any = {};
    for (const [key, value] of Object.entries(props)) {
      dropBoxPropsClone[key] = { ...value };
    }
    this.dropBoxPropsMapConfig = new Map(Object.entries(dropBoxPropsClone));

    query.forEach((value, key) => {
      if (this.dropBoxPropsMapConfig.get(key)) {
        this.dropBoxPropsMapConfig.get(key).currentValue = value
      }
    })
    this.getApi(query)
  }

  setQuery(query: Map<string, string>): Promise<Map<string, string>> {
    const queryCopy: Map<string, string | null> = query
    if (queryCopy.get('ruComponentType') === AppEnum.ALL) {
      queryCopy.set('ruComponentType', null)
    }
    return this.router.navigate([], {
      relativeTo: this.route,
      queryParams: Object.fromEntries(queryCopy),
      queryParamsHandling: 'merge',
      skipLocationChange: false
    }).then(() => {
      if (queryCopy.get('ruComponentType') === null) {
        queryCopy.delete('ruComponentType')
      }
      return queryCopy as Map<string, string>
    });
  }

  apply(payload: Map<string, string>): void {
    if (payload) {
      this.copy = []
      // console.log(payload, this.all)
      this.all.forEach((item: Partial<ComponentOptions>, index) => {
        let countProp: number = payload.size
        let countMatch: number = 0;
        payload.forEach((value, key) => {
          let val = (item.component as any)[key]
          if (val !== undefined) {
            if ((val === value || value === AppEnum.ALL) || (val === null && (value === null || value === "null"))) {
              countMatch++
            }
          }
        })
        if (countProp == countMatch) {
          this.copy.push(item as ComponentOptions)
        }
      })
      // console.log(window.location.href)
      this.changeCurrentPage(0)
      this.from = 0
      this.last = Math.ceil(this.copy.length / 20) === 0 ? 0 : Math.ceil(this.copy.length / 20) - 1
      this.to = this.copy.length / 20 <= 10 ? Math.ceil(this.copy.length / 20) : 10
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
      // console.log(this.allias)
      if (this.storage.size === 5) {

        // let componetns: any[] = this.api.getComponentsFromConfig()
        this.storage.forEach((set: any) => {
          (set as []).forEach((item: any) => {
            let markup: string = ''
            let filters: string[] = []
            let satisfyCount: number = 0;
            payload.forEach((value, key) => {
              if (item[key] && (item[key] == value || value == AppEnum.ALL) || key === 'page') {
                satisfyCount++;
              }
            })
            // let cItemIndex = componetns.findIndex(
            //   (cItem: any) => cItem.nameRu === item.ruComponentType
            // )
            // console.log(item.ruComponentType)
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
            if (payload.size == satisfyCount) {
              this.orig.push({
                component: item,
                html: this.sanitizer.bypassSecurityTrustHtml(markup),
                filters: filters,
                // img: componetns[cItemIndex].image
              })
            }
            this.all.push({
              component: item,
              html: this.sanitizer.bypassSecurityTrustHtml(markup),
              filters: filters,
              // img: componetns[cItemIndex].image
            })
            if (!this.allTableColumns.get(item.ruComponentType)) {
              const tmp = new Map()
              for (const key in item) {
                const componentProps = this.dropBoxPropsMapConfig.get(key)
                const alliasName = this.allias.get(`${key}`)
                if (alliasName && componentProps && key !== 'ruComponentType') {
                  tmp.set(key, alliasName)
                }
              }
              this.allTableColumns.set(item.ruComponentType, tmp)

            }
          })
        })
        this.displayedRuComponentTypes = Array.from(this.storage.keys())
        this.copy = Array.from(this.orig);
        this.from = 0
        console.log(this.allTableColumns)
        this.last = Math.ceil(this.copy.length / 20) === 0 ? 0 : Math.ceil(this.copy.length / 20) - 1
        if (payload.get('page')) {
          if (!isNaN(parseInt(payload.get('page') as string))) {
            const value = parseInt(payload.get('page') as string)
            // console.log(Math.ceil(this.orig.length / 20), value)
            if (Math.ceil(this.orig.length / 20) < value) {
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
              // console.log(this.from, this.to)
            }
          }
          else {
            this.error = "Некорректный формат страницы"
            this.iconName = "invalid_file"
          }
        }
        else {
          this.to = this.copy.length / 20 <= 10 ? Math.ceil(this.copy.length / 20) : 10
        }

        this.selectPage()
        this.updatePages()

        // this.reCountPagesNumbers()
        // console.log(this.all.length)
        // console.log(this.orig.length)
        // console.log(this.copy.length)
      }
      this.loader = false
    });
  }

  onTypeSelected(ruComponentType: string): void {
    let value = ruComponentType
    if (this.dropBoxPropsMapConfig.get('ruComponentType').currentValue === ruComponentType) {
      value = AppEnum.ALL
    }
    this.dropBoxPropsMapConfig.get('ruComponentType').currentValue = value
    
    if (this.dropBoxPropsMapConfig.get('ruComponentType').currentValue === AppEnum.ALL) {
      this.tableColumns = new Map()
    }
    else {
      this.tableColumns = this.allTableColumns.get(value)!
    }
    let map = this.getSimpleKeyValueMap()
    this.setQuery(map).then((res) => {
      // console.log(res.size, res)
      this.apply(res)
    })
  }

  openComponentInfo(item: ComponentOptions): void {
    this.router.navigateByUrl(`component?ruComponentType=${item.component.ruComponentType}&&componentName=${item.component.componentName}`)
  }

  changeCurrentPage(value: number): void {
    this.currentPage = value
    this.setQuery(new Map().set('page', value))
  }

  updatePages(): void {
    this.pages = []
    for (let i = this.from; i < this.to; i++) {
      this.pages.push(i)
    }
  }

  selectPage(): void {
    this.records = []
    this.copy.forEach((item: ComponentOptions, index: number) => {
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

  // getSafeUrl(url: string): any {
  //   return this.sanitizer.bypassSecurityTrustResourceUrl(url)
  // }

  getPdfUrl(item: any): string | null {
    return !item.component.remark1 ? null : `http://localhost:5000/datasheets/${item.component.remark1}.pdf`
  }

  search(event: any): void {
    let value: string = event.target.value
    // console.log(value)
    this.records = []
    this.copy = []
    this.orig.forEach((item: ComponentOptions) => {
      if (this.include(item, value)) {
        this.copy.push(item)
      }
    })
    this.from = 0
    this.changeCurrentPage(0)
    this.last = Math.ceil(this.copy.length / 20) - 1
    this.to = this.copy.length / 20 <= 10 ? Math.ceil(this.copy.length / 20) : 10
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

  openTable(): void {
    this.router.navigateByUrl('table-builder')
  }
}