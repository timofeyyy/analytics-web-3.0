import { Component } from '@angular/core';
import { LoaderComponent } from "../components/loader/loader.component";
import { NavigatorComponent } from "../components/navigator/navigator.component";
import { ManufacturerCountTableComponent } from "../components/manufacturer-count-table/manufacturer-count-table.component";
import { ApiService1 } from '../../services/api.services1';
import getComponentTypesStat, { ManufacturerStatistic, ComponentTypeStatistic } from '../../utils/fnc1/other/componentType_statistic';
import { catchError, map } from 'rxjs';
import { ComponentTypeEnEnum } from '../../utils/enum/app.enum';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NgFor, NgStyle } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { componentStorage, fetchComponentTypes, initComponentTypes } from '../../utils/redux/component';

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
  componentTypes!: [string, ComponentTypeStatistic][];

  constructor(
    private api: ApiService1,
    private router: Router,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.all = []
    this.componentTypes = []
    this.getApi()
    componentStorage.dispatch(initComponentTypes())
    if (!Object.entries(componentStorage.getState().componentTypes).length) {
      componentStorage.dispatch(fetchComponentTypes(this.api));
    }
  }
  getApi(): void {
    this.loader = true
    this.api.getComponentsApiAll()?.pipe(map((data: any) => {
      let map: Map<string, ComponentTypeStatistic> = getComponentTypesStat(data, false)
      this.componentTypes = Array.from(map)
      let dataMap: any = new Map(Object.entries(data))
      console.log(dataMap, data)
      this.all = []
      for (const key in data) {
        this.all = [
          ...this.all,
          ...dataMap.get(key),
        ]
      }
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
  getRuComponentTypeByEn(enComponentType: string): string | undefined {
    const componentTypes: any = componentStorage.getState().componentTypes
    let ruComponentType
    for (const element of componentTypes as [{ ruComponentType: string, enComponentType: string }]) {
      console.log(element.enComponentType.toLowerCase(), enComponentType.toLowerCase())
      if (element.enComponentType.toLowerCase() === enComponentType.toLowerCase()) {
        ruComponentType = element.ruComponentType
        break
      }
    }
    return ruComponentType
  }
}
