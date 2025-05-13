import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NavigatorComponent } from '../components/navigator/navigator.component';
import { CountrySelectionComponent } from '../components/selection/country_selection/country_selection.component';
import { FiltersComponent } from '../components/filters/filters.component';
import { NgClass, NgFor, NgStyle } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../services/api.services';
import { AppEnum, ComponentTypeRuEnum } from '../../utils/enum/app.enum';
import { catchError, forkJoin, map, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentOptions } from '../../utils/types/app';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageName } from '../../utils/types/config';
import { LoaderComponent } from '../components/loader/loader.component';

@Component({
  selector: 'app-catalog',
  imports: [NavigatorComponent, CountrySelectionComponent, FiltersComponent, NgStyle, HttpClientModule, NgFor, NgClass, LoaderComponent],
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css', '../components/selection/selection.css'],
  providers: [ApiService],
  encapsulation: ViewEncapsulation.None
})



export class CatalogComponent implements OnInit {

  filter!: boolean
  records!: ComponentOptions[]
  all!: ComponentOptions[]
  allCopy!: ComponentOptions[]
  storage!: Map<any, any[]>
  pages!: number[]
  from!: number
  to!: number
  currentPage!: number
  last!: number
  loader!: boolean
  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    const query: Map<string, string> = new Map(Object.entries((this.route.snapshot.queryParamMap as any).params));
    this.loader = true
    this.filter = false
    this.records = []
    this.all = []
    this.allCopy = []
    this.pages = []
    this.to = 1
    this.from = 0
    this.currentPage = 0
    this.last = 1
    this.storage = new Map()
    this.getApi(query)
  }

  apply(payload: Map<string, string>): void {
    if (payload) {
     this.allCopy = []
      this.all.forEach((item: ComponentOptions, index) => {
        let countProp: number = payload.size
        let countMatch: number = 0;
        payload.forEach((value, key) => {
          if ((item.component as any)[key]) {

            if (index < 5) {
              console.log((item.component as any)[key] , value)
            }
            if (((item.component as any)[key] === value || value === AppEnum.ALL)) {
              countMatch++
            }
          }
        })

        if (countProp == countMatch) {
          this.allCopy.push(item)
        }
      })
      console.log(this.allCopy.length)
      this.from = 0
      this.last = Math.ceil(this.allCopy.length / 20) === 0 ? 0 : Math.ceil(this.allCopy.length / 20) - 1
      this.to = this.allCopy.length / 20 <= 10 ? Math.ceil(this.allCopy.length / 20) : 10
      console.log(this.last, this.to, this.from)

      this.updatePages()
      this.selectPage()
      this.currentPage = 0
    }
    this.filter = false
  }

  getApi(payload: Map<string, string> | void): void {

    const observable = new Observable((subscriber) => {

      this.api.getDiods()
        ?.pipe(map(
          (api: any) => api
        ),
          catchError((err: any) => {
            console.log(err)
            this.router.navigate(['not-found'])
            return []
          }))
        ?.subscribe(data => this.storage.set(ComponentTypeRuEnum.DIOD, data))

      this.api.getTransistors()
        ?.pipe(map(
          (api: any) => api
        ),
          catchError((err: any) => {
            console.log(err)
            this.router.navigate(['not-found'])
            return []
          }))
        ?.subscribe(data => this.storage.set(ComponentTypeRuEnum.TRANSISTOR, data))

      this.api.getCapacitors()
        ?.pipe(map(
          (api: any) => api
        ),
          catchError((err: any) => {
            console.log(err)
            this.router.navigate(['not-found'])
            return []
          }))
        ?.subscribe(data => this.storage.set(ComponentTypeRuEnum.CAPACITOR, data))

      this.api.getMicrochips()?.pipe(map(
        (api: any) => api
      ),
        catchError((err: any) => {
          console.log(err)
          this.router.navigate(['not-found'])
          return []
        }))
        ?.subscribe(data => {
          this.storage.set(ComponentTypeRuEnum.MICROCHIP, data)
          // subscriber.complete()
        })
    });

    forkJoin([
      this.api.getDiods(),
      this.api.getTransistors(),
      this.api.getCapacitors(),
      this.api.getMicrochips()
    ]).subscribe(res => {
      console.log(res)

      this.storage.set(ComponentTypeRuEnum.DIOD, (res as any[])[0])
      this.storage.set(ComponentTypeRuEnum.TRANSISTOR, (res as any[])[1])
      this.storage.set(ComponentTypeRuEnum.CAPACITOR, (res as any[])[2])
      this.storage.set(ComponentTypeRuEnum.MICROCHIP, (res as any[])[3])
      if (this.storage.size === 4) {
        let componetns: ImageName[] = this.api.getComponentsFromConfig()
        this.storage.forEach((set: any) => {
          (set as []).forEach((item: any) => {
            let markup: string = ''
            let filters: string[] = []
            switch (item.ruComponentType) {
              case ComponentTypeRuEnum.MICROCHIP:
                markup = `
                <p>technology: ${item.ruTechnologyName}</p>
                <p>bitDepthValue: ${item.bitDepthValue}</p>
                <p>minOperatingTemperature: ${item.minOperatingTemperature}</p>
                <p>maxOperatingTemperature: ${item.maxOperatingTemperature}</p>
                <p>radiationResistance: ${item.radiationResistance}</p>
              `
                // filters = ['ruTechnologyName', 'bitDepthValue']
                break;
              case ComponentTypeRuEnum.DIOD:
                markup = `
                <p>minOperatingTemperature: ${item.minOperatingTemperature}</p>
                <p>maxOperatingTemperature: ${item.maxOperatingTemperature}</p>
                <p>radiationResistance: ${item.radiationResistance}</p>
              `
                break;
              case ComponentTypeRuEnum.TRANSISTOR:
                markup = `
                  <p>minOperatingTemperature: ${item.minOperatingTemperature}</p>
                  <p>maxOperatingTemperature: ${item.maxOperatingTemperature}</p>
                  <p>radiationResistance: ${item.radiationResistance}</p>
                `
                break;
              case ComponentTypeRuEnum.RESISTOR:
                markup = `
                    <p>minOperatingTemperature: ${item.minOperatingTemperature}</p>
                    <p>maxOperatingTemperature: ${item.maxOperatingTemperature}</p>
                    <p>radiationResistance: ${item.radiationResistance}</p>
                  `
                break;
              case ComponentTypeRuEnum.CAPACITOR:
                markup = `
                  <p>minOperatingTemperature: ${item.minOperatingTemperature}</p>
                  <p>maxOperatingTemperature: ${item.maxOperatingTemperature}</p>
                  <p>maxCapacity: ${item.maxCapacity}</p>                   
                  <p>minCapacity: ${item.minCapacity}</p>
                `
                break;
            }
            let cItemIndex = componetns.findIndex(
              (cItem: ImageName) => cItem.nameRu === item.ruComponentType
            )

            this.all.push({
              component: item,
              html: this.sanitizer.bypassSecurityTrustHtml(markup),
              filters: filters,
              img: componetns[cItemIndex].image
            })
          })
        })

        this.allCopy = Array.from(this.all);
        // this.last = Math.ceil(this.all.length / 20) === 0 ? 0 : Math.ceil(this.all.length / 20) - 1
        // this.to = this.all.length / 20 <= 10 ? Math.ceil(this.all.length / 20) : 10
        this.updatePages()
        this.selectPage()
        this.loader = false

        if(payload) {
          this.apply(payload)
        }
      }
    });
  }

  updatePages(): void {
    this.pages = []
    for (let i = this.from; i < this.to; i++) {
      this.pages.push(i)
    }
  }
  selectPage(): void {
    this.records = []
    this.allCopy.forEach((item: ComponentOptions, index: number) => {
      if (index >= (this.currentPage) * 20 && index < (this.currentPage + 1) * 20) {
        this.records.push(item)
      }
    })
  }

  prev(): void {
    if (this.currentPage > 0) {
      this.currentPage--
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
      this.currentPage++
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
    this.currentPage = this.last
    this.updatePages()
    this.selectPage()
  }

  nextSet(): void {
    if (this.to <= this.last) {
      this.from += 10
      this.to = this.to + 10 > this.last ? this.last + 1 : this.to + 10
      this.currentPage = this.from
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
      this.currentPage = this.from
      this.updatePages()
      this.selectPage()
    }
  }


  getSafeUrl(url: string): any {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url)
  }

  search(event: any): void {
    let value: string = event.target.value
    console.log(value)
    this.records = []
    this.allCopy = []
    this.all.forEach((item: ComponentOptions) => {
      if (this.include(item, value)) {
        this.allCopy.push(item)
      }
    })
    this.from = 0
    this.currentPage = 0
    this.last = Math.ceil(this.allCopy.length / 20) - 1
    this.to = this.allCopy.length / 20 <= 10 ? Math.ceil(this.allCopy.length / 20) : 10
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
