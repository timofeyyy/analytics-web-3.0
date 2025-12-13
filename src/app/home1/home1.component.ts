import { Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { LoaderComponent } from "../components/loader/loader.component";
import { NavigatorComponent } from "../components/navigator/navigator.component";
import { ApiService } from '../../services/api.services';
import getComponentTypesStat, { ManufacturerStatistic, ComponentTypeStatistic, ComponentTypePopup } from '../../utils/fnc1/other/component-type-statistic';
import { catchError, concatMap, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe, NgFor, NgIf, NgStyle, NgClass } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { componentStorage } from '../../utils/redux/component';
import { ParameterValueCountTableComponent } from "../components/parameter-value-count-table/parameter-value-count-table.component";
import { ComponentTypes } from '../../utils/types/app';
import { ComponentTypeService } from '../../services/component-type.service';
import { ChartTemplateComponent } from "../components/charts/chart-template.component";
import { AppEnum } from '../../utils/enum/app.enum';
import { SelectListComponent } from "../components/select-list/select-list.component";
import { CdkNoDataRow } from "@angular/cdk/table";
import { ComponentAnalyticsComponent } from "../component-analytics/component-analytics.component";
import { ComponentAnalyticsDateCompareComponent } from '../component-analytics-date-compare/component-analytics-date-compare.component';

@Component({
  selector: 'app-home',
  imports: [NavigatorComponent, HttpClientModule, LoaderComponent, NgStyle, NgIf, NgFor, ParameterValueCountTableComponent, ChartTemplateComponent, NgClass, ComponentAnalyticsDateCompareComponent],
  providers: [ApiService, ComponentTypeService, DatePipe],
  templateUrl: './home1.component.html',
  styleUrls: ['./home1.component.css', '../components/styles/button.css']
})
export class Home1Component {
  countriesComparingStat: Map<string, string> = new Map()
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
        const resultStorage: any = {}
        for (const key in this.storage) {
          const all = (this.storage[key] as any[]).filter(item => {
            let dateStr = item['InsertionDate']
            if (dateStr) {
              // dateStr = dateStr.replace('T', ' ').split(' ')[0]
              return dateStr >= dates[0] && dateStr <= dates[1]
            }
            return true
          })
          if (all.length) {
            resultStorage[key] = all
            const componentType = componentTypes.find(item => item.EnComponentType == key)
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
        componentTypesTmp.unshift({ RuComponentType: AppEnum.ALL, EnComponentType: AppEnum.ALL })
        return of([componentTypesTmp, all, resultStorage])
      })
    )
      .subscribe(([componentTypes, all, resultStorage]) => {
        // this.componentTypes = Array.from(componentTypes)
        setTimeout(() => {
          this.all = all;
          this.componentTypes = componentTypes;
        }, 0);
        // this.all = all
        this.resultStorage = resultStorage
        let map: Map<string, ComponentTypePopup> = getComponentTypesStat(resultStorage, true, componentTypes)
        this.componentTypesStat = Array.from(map)
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
    const sortedDates = all.sort((a, b) =>
      new Date(a.InsertionDate).getTime() - new Date(b.InsertionDate).getTime()
    );
    // const sortedDates = all.sort((a: any, b: any) => a['InsertionDate'] - b['InsertionDate'])
    let [minDate, maxDate, fromDate, lastDate] = [
      this.datePipe.transform(new Date(sortedDates[0]['InsertionDate']), 'yyyy-MM-dd')!,
      this.datePipe.transform(new Date(sortedDates[sortedDates.length - 1]['InsertionDate']), 'yyyy-MM-dd')!,
      this.datePipe.transform(new Date(sortedDates[0]['InsertionDate']), 'yyyy-MM-dd')!,
      this.datePipe.transform(new Date(sortedDates[sortedDates.length - 1]['InsertionDate']), 'yyyy-MM-dd')!
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
  windowState: "main" | "dates-compare" = "main"

  alias: any = {};
  componentDates: any = {}
  getApi(query: Map<string, any>): void {
    console.log("sds")
    this.loader = true
    this.api.getAlias()
      .pipe(
        concatMap((alias: { [type: string]: string }) => {
          this.alias = new Map(Object.entries(alias))
          const obs = [
            this.api.getComponentsAll(),
            this.api.getComponentNames(),
            this.api.getComponentsAllDates()
          ]
          return forkJoin(obs)
        })
      )
      .subscribe((res: any) => {
        // let map: Map<string, ComponentTypeStatistic> = getComponentTypesStat(res[0], true, res[1])

        // this.componentTypesStat = Array.from(map)
        // this.componentTypes = res[1]
        // this.componentTypes.unshift({ EnComponentType: AppEnum.ALL, RuComponentType: AppEnum.ALL })
        // this.currentComponentType = res[1][0]
        this.componentDates = res[2]
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
        [this.minDate, this.maxDate, this.firstDate, this.lastDate] = this.extractDates(all, query)
        this.update([this.firstDate, this.lastDate])

        this.loader = false;
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
    this.chartQueryManufacturers = new Map().set("componentTypes", this.cts.getComponentTypes()).set("sortParam", sortParam).set("sortDirectopn", sortDirectopn).set("EnComponentType", this.currentComponentType ? this.currentComponentType.EnComponentType : undefined)
  }
  buildChartQueryStat(): void {
    this.chartQueryStat = new Map()
      .set("componentTypes", this.cts.getComponentTypes())
  }

  getSafeUrl(RuComponentType: string, EnComponentKind: string | void): any {
    const componentType: any = this.cts.getComponentTypeByRu(RuComponentType)
    // const componentType: any = this.cts.getComponentTypes().find((val: any) => val.RuComponentType === RuComponentType)
    // return this.sanitizer.bypassSecurityTrustResourceUrl(`component-analytic/${componentType.EnComponentType}`)
    let url: string = `selection-main?EnComponentType=${componentType.EnComponentType}&fromDate=${this.firstDate}&lastDate=${this.lastDate}`
    if (EnComponentKind) {
      url += `&EnComponentKind=${EnComponentKind}`
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
  getRuComponentTypeByEn(EnComponentType: string): string | undefined {
    const componentTypes = this.cts.getComponentTypes()
    let RuComponentType
    for (const element of componentTypes) {
      if (element.EnComponentType === EnComponentType) {
        RuComponentType = element.RuComponentType
        break
      }
    }
    return RuComponentType
  }
}
