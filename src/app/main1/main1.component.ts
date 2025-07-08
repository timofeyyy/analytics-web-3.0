import { NgFor, NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, Output, ViewEncapsulation } from '@angular/core';
// import { AppEnum, ComponentTypeRuEnum } from '../../utils/enum/app.enum';
// import { ChartConfig, ChartRoute, ComponentData, ComponentType, Config, Country, CountryOptions, DropdownOptions, Option, OptionsApi } from '../../utils/types/app';
import { catchError, map } from 'rxjs';
import { AppEnum, ComponentTypeEnEnum, ComponentTypeRuEnum } from '../../utils/enum/app.enum';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import getBestManufacturer from '../../utils/fnc1/other/best_manufacturer_prod.fnc';
import getManufacturersProd from '../../utils/fnc1/other/manufacturers_prod.fnc';
import { LoaderComponent } from '../components/loader/loader.component';
import { NavigatorComponent } from '../components/navigator/navigator.component';
import { ApiService1 } from '../../services/api.services1';
import { ManufacturerCountTableComponent } from "../components/manufacturer-count-table/manufacturer-count-table.component";
import getComponentTypesStat, { ManufacturerStatistic, RuComponentTypeStatistic } from '../../utils/fnc1/other/componentType_statistic';

@Component({
  selector: 'app-main1',
  imports: [NgStyle, NgFor, HttpClientModule, LoaderComponent, NavigatorComponent, ManufacturerCountTableComponent],
  templateUrl: './main1.component.html',
  styleUrls: ['./main1.component.css', '../components/selection/selection.css', '../components/styles/filter.css'],
  providers: [ApiService1],
  encapsulation: ViewEncapsulation.None
})
export class Main1Component implements OnInit {
  componentTypes!: [string, RuComponentTypeStatistic][]
  loader!: boolean
  url!: SafeResourceUrl
  all: any
  constructor(
    private api: ApiService1,
    private router: Router,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    // this.rows = []
    this.all = []
    this.componentTypes = []
    this.loader = true
    this.getApi()
    this.selectComponentTypes()
  }

  getApi(): void {
    this.api.getComponentsApiAll()?.pipe(map((data: any[]) => {
      let map: Map<string, RuComponentTypeStatistic> = getComponentTypesStat(data)
      this.componentTypes = Array.from(map)
      let dataMap = new Map(Object.entries(data))
      this.all = [
        ...dataMap.get(ComponentTypeEnEnum.MICROCHIP),
        ...dataMap.get(ComponentTypeEnEnum.CAPACITOR),
        ...dataMap.get(ComponentTypeEnEnum.DIOD),
        ...dataMap.get(ComponentTypeEnEnum.RESISTOR),
        ...dataMap.get(ComponentTypeEnEnum.TRANSISTOR),
      ] 
      this.loader = false
    }),
      catchError((err: any) => {
        console.log(err.message)
        this.router.navigate([`/not-found`])
        return [];
      })
    ).subscribe()
  }

  displayManufacturers(manufacturers: Map<string, ManufacturerStatistic>): any {
    let res = ""
    if (manufacturers.size) {
      const object = Object.fromEntries(manufacturers)
      for (const key in object) {
        res += `<p>${key} - ${object[key].procentComparedToComponentTypes}%</p>`
      }
    }

    return this.sanitizer.bypassSecurityTrustHtml(res)
  }
  // getManufacturersAsString(manufacturers: Map<string, ManufacturerStatistic>): string {
  //   let res = ""
  //   console.log(manufacturers)
  //   if (manufacturers.size) {
  //     res = Array.from(manufacturers.keys()).join(', ')
  //     res += ` - ${Array.from(manufacturers.values())[0].procentComparedToComponentTypes}`
  //   }
  //   return res
  // }


  type!: string
  selectComponentTypes(value: string | void): void {
    let url = "chart/components/ruComponentType-next-chart/bar?"
    if (value !== this.type) {
      this.componentTypes.forEach((type: [string, RuComponentTypeStatistic]) => {
        if (value === type[0] && this.type !== value) {
          console.log(this.type, value)
          url += `ruComponentType=${value}`
          this.type = value
        }
      })
    }
    else {
      this.type = ''
    }
    this.url = this.getSafeUrl(url)
  }

  getSafeUrl(url: string): any {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url)
  }
}
