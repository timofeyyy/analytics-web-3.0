import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NavigatorComponent } from '../components/navigator/navigator.component';
import { CountrySelectionComponent } from '../components/selection/country-selection/country-selection.component';
import { FiltersComponent } from '../components/filters/filters.component';
import { NgClass, NgFor, NgStyle } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from '../../services/api.services';
import { ComponentTypeRuEnum } from '../../utils/enum/app.enum';
import { catchError, map, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Test } from '../../utils/types/app';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageName } from '../../utils/types/config';

@Component({
  selector: 'app-catalog',
  imports: [NavigatorComponent, CountrySelectionComponent, FiltersComponent, NgStyle, HttpClientModule, NgFor, NgClass],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.css',
  providers: [ApiService],
  encapsulation: ViewEncapsulation.None
})



export class CatalogComponent implements OnInit {

  filter!: boolean
  records!: Test[]
  all!: Test[]
  storage!: Map<any, any[]>
  pages!: number[]
  from!: number
  to!: number
  currentPage!: number
  last!: number
  constructor(
    private api: ApiService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.filter = false
    this.records = []
    this.all = []
    this.pages = []
    this.to = 1
    this.from = 0
    this.currentPage = 0
    this.last = 1
    this.storage = new Map()
    this.getApi()
  }

  onSubmit(action: boolean): void {
    this.filter = false
  }

  getApi(): void {

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
          subscriber.complete()
        })
    });

    observable.subscribe({
      complete: () => {
        console.log(this.storage)
        let componetns: ImageName[] = this.api.getComponentsFromConfig()
        this.storage.forEach((set: any) => {
          (set as []).forEach((item: any) => {
            let markup: string = ''
            switch (item.ruComponentType) {
              case ComponentTypeRuEnum.MICROCHIP:
                markup = `
                  <p>technology: ${item.ruTechnologyName}</p>
                  <p>bitDepthValue: ${item.bitDepthValue}</p>
                  <p>minOperatingTemperature: ${item.minOperatingTemperature}</p>
                  <p>maxOperatingTemperature: ${item.maxOperatingTemperature}</p>
                  <p>radiationResistance: ${item.radiationResistance}</p>
                `
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
              manufacturerName: item.manufacturerName,
              ruComponentKind: item.ruComponentKind,
              ruComponentType: item.ruComponentType,
              componentName: item.componentName,
              html: this.sanitizer.bypassSecurityTrustHtml(markup),
              img: componetns[cItemIndex].image
            })
          })
        })
        this.last = Math.floor(this.all.length / 20) - 1
        this.to = this.all.length / 20 <= 10 ? Math.floor(this.all.length / 20) : 10

        this.updatePages()
        this.selectPage()

      },
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
    this.all.forEach((item: Test, index: number) => {
      if(index >= (this.currentPage) * 20 && index < (this.currentPage + 1) * 20) {
        this.records.push(item)
      }
    })
  }

  prev(): void {
    if (this.currentPage > 0) {
      this.currentPage--
      if (this.currentPage !== 0 && (this.currentPage + 1) % 10 === 0) {
        this.from -= 10
        if(this.to % 10 === 0) {
          this.to -= 10
        }
        else {
          this.to = this.to-(this.to%10)
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

  getLatest(): void{
    this.from = this.last - this.last%10
    this.to = this.last + 1
    this.currentPage = this.last
    this.updatePages()
    this.selectPage()
  }

  nextSet(): void {
    if(this.to <= this.last) {
      this.from += 10
      this.to = this.to + 10 > this.last ? this.last + 1 : this.to + 10
      this.currentPage = this.from
      this.updatePages()
      this.selectPage()
    }
  } 

  prevSet(): void {
    if(this.from !=0) {
      this.from -= 10
      if(this.to % 10 === 0) {
        this.to -= 10
      }
      else {
        this.to = this.to-(this.to%10)
      }
      this.currentPage = this.from
      this.updatePages()
      this.selectPage()
    }
  } 

  
  getSafeUrl(url: string): any {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url)
  }
}
