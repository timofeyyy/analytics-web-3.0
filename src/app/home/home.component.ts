import { Component } from '@angular/core';
import { LoaderComponent } from "../components/loader/loader.component";
import { NavigatorComponent } from "../components/navigator/navigator.component";
import { ApiService } from '../../services/api.services1';
import getComponentTypesStat, { ManufacturerStatistic, ComponentTypeStatistic } from '../../utils/fnc1/other/component_type_statistic';
import { catchError, forkJoin, map } from 'rxjs';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NgFor, NgStyle } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { componentStorage, initComponentTypes } from '../../utils/redux/component';
import { ParameterValueCountTableComponent } from "../components/parameter-value-count-table/parameter-value-count-table.component";
import { QueryPageSettings } from '../../services/query.settings.service';
import { ComponentTypes } from '../../utils/types/app';

@Component({
  selector: 'app-home',
  imports: [NavigatorComponent, HttpClientModule, LoaderComponent, NgStyle, NgFor, ParameterValueCountTableComponent],
  providers: [ApiService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  all: any
  loader!: boolean
  componentTypesStat!: [string, ComponentTypeStatistic][];
  componentTypes: ComponentTypes[] = []
  navigation!: boolean

  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    this.all = []
    this.componentTypesStat = []
    this.getApi()
    // this.navigation = this.isFullView()
  }

  getApi(): void {
    this.loader = true
    forkJoin([
      this.api.getComponentsApiAll(),
      this.api.getComponentNames()
    ]).subscribe((res: any) => {
      let map: Map<string, ComponentTypeStatistic> = getComponentTypesStat(res[0], true)
      this.componentTypesStat = Array.from(map)
      this.componentTypes = res[1]
      let dataMap: any = new Map(Object.entries(res[0]))
      this.all = []
      for (const key in res[0]) {
        this.all = [
          ...this.all,
          ...dataMap.get(key),
        ]
      }
      this.loader = false
    })
  }

  getSafeUrl(ruComponentType: string): any {
    const componentType: any = this.componentTypes.find((val: any) => val.ruComponentType === ruComponentType)
    return this.sanitizer.bypassSecurityTrustResourceUrl(`component-analytic/${componentType.enComponentType}`)
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
      if (element.enComponentType.toLowerCase() === enComponentType.toLowerCase()) {
        ruComponentType = element.ruComponentType
        break
      }
    }
    return ruComponentType
  }
}
