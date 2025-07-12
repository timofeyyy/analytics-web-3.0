import { Component } from '@angular/core';
import { LoaderComponent } from "../components/loader/loader.component";
import { NavigatorComponent } from "../components/navigator/navigator.component";
import { ManufacturerCountTableComponent } from "../components/manufacturer-count-table/manufacturer-count-table.component";
import { ApiService1 } from '../../services/api.services1';
import getComponentTypesStat, { ManufacturerStatistic, RuComponentTypeStatistic } from '../../utils/fnc1/other/componentType_statistic';
import { catchError, map } from 'rxjs';
import { ComponentTypeEnEnum } from '../../utils/enum/app.enum';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NgFor, NgStyle } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  imports: [NavigatorComponent, ManufacturerCountTableComponent, HttpClientModule, LoaderComponent, NgStyle, NgFor],
  providers: [ApiService1],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  all: any
  loader!: boolean
  componentTypes!: [string, RuComponentTypeStatistic][];

  constructor(
    private api: ApiService1,
    private router: Router,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.all = []
    this.componentTypes = []
    this.loader = true
    this.getApi()
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


  getSafeUrl(url: string): any {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url)
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
}
