import { Component } from '@angular/core';
import { LoaderComponent } from "../components/loader/loader.component";
import { NavigatorComponent } from "../components/navigator/navigator.component";
import { ApiService } from '../../services/api.services';
import getComponentTypesStat, { ManufacturerStatistic, ComponentTypeStatistic } from '../../utils/fnc1/other/component-type-statistic';
import { catchError, concatMap, forkJoin, map } from 'rxjs';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NgFor, NgIf, NgStyle } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { componentStorage } from '../../utils/redux/component';
import { ParameterValueCountTableComponent } from "../components/parameter-value-count-table/parameter-value-count-table.component";
import { ComponentTypes } from '../../utils/types/app';
import { ComponentTypeService } from '../../services/component-type.service';
import { ChartTemplateComponent } from "../components/charts/chart-template.component";
import { AppEnum } from '../../utils/enum/app.enum';

@Component({
  selector: 'app-home',
  imports: [NavigatorComponent, HttpClientModule, LoaderComponent, NgStyle, NgIf, NgFor, ParameterValueCountTableComponent, ChartTemplateComponent],
  providers: [ApiService, ComponentTypeService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  onSortDirectionChanged(entry: [string, string]) {
    this.buildChartQueryManufacturers(entry[0], entry[1])
  }
  getChartQuery(): Map<string, string> {
    return new Map().set("componentTypes", this.cts.getComponentTypes())
  }

  all: any = []
  storage: any
  loader!: boolean
  componentTypesStat!: [string, ComponentTypeStatistic][];
  navigation!: boolean
  chartQueryManufacturers!: Map<string, string>
  chartQueryStat!: Map<string, string>
  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private cts: ComponentTypeService
  ) { }

  ngOnInit(): void {
    this.componentTypesStat = []
    this.getApi()
    // this.navigation = this.isFullView()
  }

  getApi(): void {
    this.loader = true

    this.api.getAlias()
      .pipe(
        concatMap((alias: { [type: string]: string }) => {
          const obs = [
            this.api.getComponentsApiAll(),
            this.api.getComponentNames()
          ]
          return forkJoin(obs)
        })
      )
      .subscribe((res: any) => {
        let map: Map<string, ComponentTypeStatistic> = getComponentTypesStat(res[0], true, res[1])
        this.storage = res[0]
        this.componentTypesStat = Array.from(map)
        this.cts.setComponentTypes(res[1])
        this.buildChartQueryManufacturers()
        this.buildChartQueryStat()
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

  buildChartQueryManufacturers(sortParam: string = AppEnum.AMOUNT, sortDirectopn: string = AppEnum.ASC): void {
    // console.log(sortParam, sortDirectopn)
    this.chartQueryManufacturers = new Map().set("componentTypes", this.cts.getComponentTypes()).set("sortParam", sortParam).set("sortDirectopn", sortDirectopn)
  }
  buildChartQueryStat(): void {
    this.chartQueryStat = new Map().set("componentTypes", this.cts.getComponentTypes())
  }

  getSafeUrl(ruComponentType: string): any {
    // // console.log(ruComponentType)
    const componentType: any = this.cts.getComponentTypeByRu(ruComponentType)

    // // console.log(componentType)
    // const componentType: any = this.cts.getComponentTypes().find((val: any) => val.ruComponentType === ruComponentType)
    return this.sanitizer.bypassSecurityTrustResourceUrl(`component-analytic/${componentType.enComponentType}`)
  }

  displayManufacturers(manufacturers: any): any {
    let res = ""
    if (manufacturers[1].manufacturers) {
      const object = Object.fromEntries(manufacturers[1].manufacturers)
      for (const key in object) {
        res += `<p>${key} - ${object[key].procentComparedToComponentTypes}%</p>`
        break
      }
    }
    return this.sanitizer.bypassSecurityTrustHtml(res)
  }
  getRuComponentTypeByEn(enComponentType: string): string | undefined {
    const componentTypes = this.cts.getComponentTypes()
    let ruComponentType
    for (const element of componentTypes) {
      if (element.enComponentType.toLowerCase() === enComponentType.toLowerCase()) {
        ruComponentType = element.ruComponentType
        break
      }
    }
    return ruComponentType
  }
}
