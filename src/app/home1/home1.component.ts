import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { LoaderComponent } from "../components/loader/loader.component";
import { NavigatorComponent } from "../components/navigator/navigator.component";
import { ApiService } from '../../services/api.services';
import getComponentTypesStat, { ManufacturerStatistic, ComponentTypeStatistic, ComponentTypePopup } from '../../utils/fnc1/other/component-type-statistic';
import { catchError, concatMap, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe, NgFor, NgIf, NgStyle } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { componentStorage } from '../../utils/redux/component';
import { ParameterValueCountTableComponent } from "../components/parameter-value-count-table/parameter-value-count-table.component";
import { ComponentTypes } from '../../utils/types/app';
import { ComponentTypeService } from '../../services/component-type.service';
import { ChartTemplateComponent } from "../components/charts/chart-template.component";
import { AppEnum } from '../../utils/enum/app.enum';
import { SelectListComponent } from "../components/select-list/select-list.component";

@Component({
  selector: 'app-home',
  imports: [NavigatorComponent, HttpClientModule, LoaderComponent, NgStyle, NgIf, NgFor, ParameterValueCountTableComponent, ChartTemplateComponent],
  providers: [ApiService, ComponentTypeService, DatePipe],
  templateUrl: './home1.component.html',
  styleUrls: ['./home1.component.css', '../components/styles/button.css']
})
export class Home1Component {
  changeFirstDate(event: any) {
    const target = event.target as HTMLInputElement;
    if (target.value != "")
      this.firstDate = this.datePipe.transform(new Date(target.value), 'yyyy-MM-dd')!
  }
  changeLastDate(event: any) {
    const target = event.target as HTMLInputElement;
    if (target.value != "")
      this.lastDate = this.datePipe.transform(new Date(target.value), 'yyyy-MM-dd')!
  }
  update(dates: [string, string]) {
    of(null).pipe(
      switchMap((res) => {
        const componentTypes = Array.from(this.cts.getComponentTypes())
        const componentTypesTmp = []
        this.all = []
        this.componentTypes = []
        // // console.log(this.all.length, this.componentTypes.length)
        const resultStorage: any = {}
        for (const key in this.storage) {
          const all = (this.storage[key] as any[]).filter(item => !item['insertion'] || (item['insertion'] >= dates[0] && item['insertion'] <= dates[1]))
          if (all.length) {
            resultStorage[key] = all
            const componentType = componentTypes.find(item => item.enComponentType.toLowerCase() == key.toLowerCase())
            componentTypesTmp.push(componentType!)
          }
        }
        let dataMap: any = new Map(Object.entries(resultStorage))
        let all: any = []
        for (const key in resultStorage) {
          all = [
            ...all,
            ...dataMap.get(key),
          ]
        }
        componentTypesTmp.unshift({ ruComponentType: AppEnum.ALL, enComponentType: AppEnum.ALL })
        return of([componentTypesTmp, all, resultStorage])
      })
    )
      .subscribe(([componentTypes, all, resultStorage]) => {
        // // console.log(componentTypes, all, resultStorage)
        // this.componentTypes = Array.from(componentTypes)
        setTimeout(() => {
          this.all = all;
          this.componentTypes = componentTypes;
        }, 0);
        // this.all = all
        this.resultStorage = resultStorage
        let map: Map<string, ComponentTypePopup> = getComponentTypesStat(resultStorage, true, componentTypes)
        this.componentTypesStat = Array.from(map)
        // console.log(map)
        this.currentComponentType = undefined
        this.buildChartQueryManufacturers()
        this.buildChartQueryStat()
        // if(upTable)
        //   this.pvct.initOriginalRecords(all)
      })
  }
  currentComponentType: ComponentTypes | undefined
  onComponentTypeChanged(componentType: ComponentTypes) {
    this.currentComponentType = componentType
  }
  onSortDirectionChanged(entry: [string, string]) {
    this.buildChartQueryManufacturers(entry[0], entry[1])
  }
  getChartQuery(): Map<string, string> {
    return new Map().set("componentTypes", this.cts.getComponentTypes())
  }
  @ViewChild(ParameterValueCountTableComponent)
  pvct!: ParameterValueCountTableComponent;
  firstDate!: string
  minDate!: string
  lastDate!: string
  maxDate!: string
  all: any = []
  storage: any
  resultStorage: any
  loader!: boolean
  componentTypesStat!: [string, ComponentTypePopup][];
  navigation!: boolean
  chartQueryManufacturers!: Map<string, string>
  chartQueryStat!: Map<string, string>
  componentTypes!: ComponentTypes[]
  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private cts: ComponentTypeService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.componentTypesStat = []
    const query = new Map(Object.entries((this.route.snapshot.queryParamMap as any).params));
    this.getApi(query)
  }

  extractDates(all: any[], query: Map<string, any>): [string, string, string, string] {
    let lastDateQuery = query.get('lastDate')
    let fromDateQuery = query.get('fromDate')
    const sortedDates = all.sort((a: any, b: any) => a['insertion'] - b['insertion'])
    let [minDate, maxDate, fromDate, lastDate] = [
      this.datePipe.transform(new Date(sortedDates[0]['insertion']), 'yyyy-MM-dd')!,
      this.datePipe.transform(new Date(sortedDates[sortedDates.length - 1]['insertion']), 'yyyy-MM-dd')!,
      this.datePipe.transform(new Date(sortedDates[0]['insertion']), 'yyyy-MM-dd')!,
      this.datePipe.transform(new Date(sortedDates[sortedDates.length - 1]['insertion']), 'yyyy-MM-dd')!
    ]
    if ((fromDateQuery || !isNaN(new Date(fromDateQuery).getDate()))) {
      fromDate = this.datePipe.transform(new Date(fromDateQuery), 'yyyy-MM-dd')!
      fromDate = fromDate < minDate ? minDate : fromDate
    }
    if ((lastDateQuery || !isNaN(new Date(lastDateQuery).getDate()))) {
      lastDate = this.datePipe.transform(new Date(lastDateQuery), 'yyyy-MM-dd')!
      lastDate = lastDate > maxDate ? maxDate : lastDate
    }
    return [minDate, maxDate, fromDate, lastDate]
  }

  getApi(query: Map<string, any>): void {
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
        // let map: Map<string, ComponentTypeStatistic> = getComponentTypesStat(res[0], true, res[1])

        // this.componentTypesStat = Array.from(map)
        // this.componentTypes = res[1]
        // this.componentTypes.unshift({ enComponentType: AppEnum.ALL, ruComponentType: AppEnum.ALL })
        // this.currentComponentType = res[1][0]
        // // console.log(res[1])
        this.cts.setComponentTypes(res[1])
        this.storage = res[0]
        // this.resultStorage = this.storage
        // this.buildChartQueryManufacturers()
        // this.buildChartQueryStat()
        // let dataMap: any = new Map(Object.entries(res[0]))
        let all: any[] = []
        for (const key in res[0]) {
          all = [
            ...all,
            ...res[0][key],
          ]
        }
        // console.log(all);
        // console.log(this.pvct);
        [this.minDate, this.maxDate, this.firstDate, this.lastDate] = this.extractDates(all, query)
        this.update([this.firstDate, this.lastDate])

        this.loader = false;
        // // console.log([this.minDate, this.maxDate, this.firstDate, this.lastDate])
      })
  }
  validateDate(event: any) {
    const input = event.target;
    const value = input.value;

    if (!value) return;

    const date = new Date(value);
    const min = new Date(this.minDate);
    const max = new Date(this.maxDate);

    if (date < min) {
      input.value = this.minDate;
    } else if (date > max) {
      input.value = this.maxDate;
    }
  }

  buildChartQueryManufacturers(sortParam: string = AppEnum.AMOUNT, sortDirectopn: string = AppEnum.ASC): void {
    // // console.log(sortParam, sortDirectopn)
    this.chartQueryManufacturers = new Map().set("componentTypes", this.cts.getComponentTypes()).set("sortParam", sortParam).set("sortDirectopn", sortDirectopn).set("enComponentType", this.currentComponentType ? this.currentComponentType.enComponentType : undefined)
  }
  buildChartQueryStat(): void {
    this.chartQueryStat = new Map()
      .set("componentTypes", this.cts.getComponentTypes())
  }

  getSafeUrl(ruComponentType: string, enComponentKind: string | void): any {
    // // // console.log(ruComponentType)
    const componentType: any = this.cts.getComponentTypeByRu(ruComponentType)

    // // // console.log(componentType)
    // const componentType: any = this.cts.getComponentTypes().find((val: any) => val.ruComponentType === ruComponentType)
    // return this.sanitizer.bypassSecurityTrustResourceUrl(`component-analytic/${componentType.enComponentType}`)
    let url: string = `selection-main?enComponentType=${componentType.enComponentType}&fromDate=${this.firstDate}&lastDate=${this.lastDate}`
    if(enComponentKind){
      url += `&enComponentKind=${enComponentKind}`
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(url)
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
