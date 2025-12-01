import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavigatorComponent } from "../../components/navigator/navigator.component";
import { LoaderComponent } from "../../components/loader/loader.component";
import { DatePipe, NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { SelectListComponent } from "../../components/select-list/select-list.component";
import { ApiService } from '../../../services/api.services';
import { concatMap, forkJoin, from, map, of, pipe } from 'rxjs';
import { AppEnum } from '../../../utils/enum/app.enum';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { isException } from '../../../utils/static-data/filter-exceptions';
import { SelectListCheckboxComponent } from "../../components/select-list-checkbox/select-list-checkbox.component";
import { ParameterSortingComponent } from "../../components/parameter-sorting/parameter-sorting.component";
import { Columns, ComponentTypes } from '../../../utils/types/app';
import { PageLabelsComponent } from "../../catalog/page-labels/page-labels.component";
// import { propsMap } from '../../fetch.config';
import { QuerySettingsService } from '../../../services/query-settings.service';
import { ComponentAnalyticsComponent } from "../../component-analytics/component-analytics.component";
import { ReportBuilderComponent } from "../../reports/report-builder/report-builder.component";
import { chartNamesMap } from '../../../utils/static-data/chart-names';
import { ComponentTypeService } from '../../../services/component-type.service';
import { Observable } from '@reduxjs/toolkit';
import { EmptyValuePipe } from '../../../pipes/empty-value.pipe';
import { DomSanitizer } from '@angular/platform-browser';
import { InputNumericComponent, PriorityField } from "../../components/input-numeric/input-numeric.component";

@Component({
  selector: 'app-selection-main',
  imports: [HttpClientModule, NavigatorComponent, LoaderComponent, NgStyle, SelectListComponent, NgFor, NgClass, SelectListCheckboxComponent, ParameterSortingComponent, PageLabelsComponent, NgIf, ComponentAnalyticsComponent, EmptyValuePipe],
  providers: [ApiService, QuerySettingsService, ComponentTypeService, DatePipe],
  templateUrl: './selection-main.component.html',
  styleUrls: ['./selection-main.component.css', '../../components/styles/button.css', '../../components/styles/categories.css', '../../components/styles/input.css']
})
export class SelectionMainComponent implements OnInit {
  resetPagesExecute(): void {
    this.resetPages().then(() => this.initColumns())
  }
  onSortValueSelected() {
    this.preparedRows = Array.from(this.resultBuffer.map((val) => this.getObjEntry(val)))
    this.selectPage(0)
  }
  ngOnInit(): void {
    this.api.getAlias()
      .subscribe((alias: { [column: string]: string }) => {
        this.alias = new Map<string, string>(Object.entries(alias))
        const query = new Map(Object.entries((this.route.snapshot.queryParamMap as any).params));
        this.getApi(query)
      })
  }

  // getPriorityArrayFromQuery(): [string, string][] {
  //   const priorities: [string, string][] = []
  //   const queryObj = (this.route.snapshot.queryParamMap as any).params
  //   for (const key in queryObj) {
  //     if (this.alias.get(key) && key !== 'enComponentType') {
  //       priorities.push([key, queryObj[key]])
  //     }
  //   }
  //   return priorities
  // }

  getComponentTypes(): ComponentTypes[] {
    return this.cts.getComponentTypes()
  }
  getCurrentComponentType(): ComponentTypes {
    return this.cts.getCurrentComponentType()
  }

  reportWindow!: boolean
  chartView!: boolean
  loader!: boolean
  storageAll!: any
  alias!: Map<string, string>
  all: any[] = []
  columns: string[] = []
  sortParam!: string
  componentTypesActive: (ComponentTypes | undefined)[] = [];
  ROWNUM: number = 100
  lastDateStr!: string
  fromDateStr!: string
  ruComponentKindStr!: string
  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private querySettings: QuerySettingsService,
    private cts: ComponentTypeService,
    private domSanitizer: DomSanitizer,
    private datePipe: DatePipe
  ) { }
  storage = {}
  specificationPath!: string
  getSpecificationHref(arg: any) {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(this.specificationPath + `${arg}.pdf`)
  }
  
  getApi(query: Map<string, any>): void {
    const enComponentType = query.get("enComponentType")
    const enComponentKind = query.get("enComponentKind")
    this.loader = true
    this.api.getPdfPath()
      .pipe(
        concatMap((path: string) => {
          this.specificationPath = path
          return this.api.getComponentNames();
        }),
        concatMap((typeNames) => {
          this.cts.setComponentTypes(typeNames)
          if (!typeNames || !typeNames.length) {
            // сделать редирект на ошибку this.ROWNUM4
          }
          let componentTypeRes = this.cts.getComponentTypeByEn(query.get('enComponentType'))
          if (componentTypeRes == null) {
            componentTypeRes = typeNames[0]
          }
          this.cts.setCurrentComponentType(componentTypeRes!)
          return this.api.getColumns(componentTypeRes?.enComponentType.toLowerCase())
        }),
        concatMap((allColumns: { [type: string]: Columns[] }) => {
          this.cts.setColumnsAll(allColumns)
          this.changeSpecificationPath(this.cts.getCurrentComponentType())
          return this.api.getComponentsApiAll(query)
        })
      )
      .subscribe((res: any) => {
        // console.log(res)
        const storageAllTmp = res
        const lastDate = new Date(query.get('lastDate'))
        const fromDate = new Date(query.get('fromDate'))

        if (!isNaN(lastDate.getDate()) && !isNaN(fromDate.getDate())) {
          this.storageAll = {}
          this.lastDateStr = this.datePipe.transform(lastDate, 'yyyy-MM-dd')!
          this.fromDateStr = this.datePipe.transform(fromDate, 'yyyy-MM-dd')!
          for (const key in storageAllTmp) {
            const all = (storageAllTmp[key] as any[]).filter(item => !item['insertion'] || (item['insertion'] >= this.fromDateStr && item['insertion'] <= this.lastDateStr))
            this.storageAll[key] = all
            if(enComponentType && key.toLowerCase() == enComponentType.toLowerCase() && all.length && enComponentKind) {
              const obj = all.find(obj => obj.enComponentKind.toLowerCase() == enComponentKind.toLowerCase())
              if(obj) {
                this.ruComponentKindStr = obj.ruComponentKind
              }
            }
          }
        }
        else {
          this.storageAll = res
        }
        this.initColumns()
        this.loader = false
      });
  }

  toMain(): void {
    this.router.navigateByUrl(`/home?fromDate=${this.fromDateStr}&lastDate=${this.lastDateStr}`)
  }

  resetPages(): Promise<Map<string, string>> {
    return this.querySettings.setQuery(new Map().set('page', 0), 'merge')
  }
  preparedRows: [string, any][][] = [];

  initColumns(): void {
    let columns = []
    this.storage = this.storageAll

    this.componentTypesActive = []
    this.cts.getComponentTypes().forEach((val, index) => {
      if (this.storageAll && this.storageAll[val.enComponentType.toLowerCase()]) {
        this.componentTypesActive.push(val)
      }
      else {
        this.componentTypesActive.push(undefined)
      }
    })
    this.all = (this.storageAll[this.cts.getCurrentComponentType().enComponentType.toLowerCase()])
    this.resultBuffer = Array.from(this.all)
    const colsMap = this.selectedColumnsMap.get(this.cts.getCurrentComponentType().enComponentType.toLowerCase())
    if (colsMap) {
      columns = Array.from(colsMap.cols.orig)
      this.activeColumns = JSON.parse(JSON.stringify(colsMap.cols))
    }
    else {
      let obj = {}
      if (this.all) {
        obj = this.all[0]
      }
      for (const key in obj) {
        let alias = this.alias.get(key)
        if (alias && (!isException(key) || key === 'manufacturerName' || key === 'componentName')) {
          columns.push(alias)
        }
      }

      this.activeColumns.current = Array.from(columns)
      this.activeColumns.currentSpaces = Array.from(columns)
      this.activeColumns.orig = Array.from(columns)
    }
    // // // console.log(this.storageFiltered, this.prioritiesChartsEntries)
    this.setSortingParam()
    this.columns = Array.from(columns)
    this.preparedRows = Array.from(this.all.map((val) => this.getObjEntry(val)))
    this.selectPage(0)
  }
  priorityInit!: boolean
  priorityChartIndex: number = 0
  prioritiesChartsEntries: any[] = []
  // onChartChangeDefault(data: any): void {
  //   if (this.priorities.length && this.priorityChartIndex < this.priorities.length) {
  //     this.onChartChange(data, this.priorities[this.priorityChartIndex][0])
  //     this.priorityChartIndex += 1
  //   }
  //   if (Object.keys(this.prioritiesCharts).length == this.priorities.length) {
  //     this.priorityInit = false
  //     this.cdr.detectChanges()
  //   }

  // }
  // onChartChangeCurrent(data: any): void {
  //   if (this.mainAction != AppEnum.ALLREC) {
  //     const param = data.mainChartQuery.get("param")
  //     const alias = data.mainChartQuery.get("alias")
  //     for (const prioritiyChart in this.prioritiesCharts) {
  //       const obj: any = this.prioritiesCharts[prioritiyChart]
  //       const oldAlias: string = obj.chartLabel.split('"')[1];
  //       obj.chartLabel = (obj.chartLabel as string).replace(oldAlias, alias)
  //       obj.mainChartQuery.set("param", param)
  //       obj.mainChartQuery.set("alias", alias)
  //     }
  //     this.onChartChange(data)
  //   }
  // }

  // onChartChange(data: any, param: string | void): void {
  //   const componentType = this.getCurrentComponentType()
  //   let actualParam = this.priority
  //   if (param) {
  //     actualParam = param
  //   }
  //   data['resultBuffer'] = {}
  //   data['resultBuffer'][componentType.enComponentType.toLowerCase()] = this.storageFiltered[componentType.enComponentType.toLowerCase()][actualParam]
  //   const priority = this.priorities.find((pr) => pr[0] == actualParam)
  //   data['mainChartQuery'].set('priority', priority)
  //   const lastColumnParam = data['mainChartQuery'].get('param')
  //   this.prioritiesCharts[actualParam] = data
  //   const builderPrioritiesCharts: any = {}
  //   for (const key in this.prioritiesCharts) {
  //     builderPrioritiesCharts[key] = Object.assign({}, this.prioritiesCharts[key])
  //     builderPrioritiesCharts[key]['mainChartQuery'] = new Map(this.prioritiesCharts[key]['mainChartQuery']).set('param', lastColumnParam)
  //     builderPrioritiesCharts[key]['mainChartQuery'].set('x-labels-size', '2vw')
  //       .set('y-labels-size', '2vw')
  //   }
  //   this.prioritiesChartsEntries = Object.entries(builderPrioritiesCharts)
  // }

  setSortingParam(): void {
    const first = this.activeColumns.current.find(val => val != undefined)
    const aliasObj = Object.fromEntries(this.alias)
    const key = Object.keys(aliasObj).find(key => aliasObj[key] == first)
    this.sortParam = key!
  }
  getObjEntry(object: any): [string, any][] {
    const res: any = []
    const objAlias = Object.fromEntries(this.alias)
    const keys = Object.keys(objAlias)
    for (const element of this.activeColumns.current) {
      const key = keys.find((val) => objAlias[val] == element)
      res.push([key, object[key!]])
    }
    return res
  }
  onComponentTypeChanged(enComponentType: ComponentTypes): void {
    this.cts.setCurrentComponentType(enComponentType)
    this.changeSpecificationPath(enComponentType)
  }
  specificationRepoPath!: string
  changeSpecificationPath(enComponentType: ComponentTypes): void {
    this.specificationRepoPath = `${this.specificationPath}${enComponentType.enComponentType}/`
  }
  openSidePanel!: boolean
  // selectionViewTypeOptions: string[] = [AppEnum.ALLREC, AppEnum.LASTSAVED]
  // selectionViewTypeOptionsIndex: number = 0
  // onSelectionViewTypeChanged(val: string): void {
  //   this.openSidePanel = (val != AppEnum.ALLREC)
  //   this.mainAction = val as any
  // }

  selectedColumnsMap: Map<string, { current: string, cols: { currentSpaces: string[], current: string[], orig: string[] } }> = new Map()
  onColumnSelected(column: string) {
    this.activeColumns.current.sort(function (a, b) {
      return a == column ? -1 : b == column ? 1 : 0;
    });

    this.selectedColumnsMap.set(this.cts.getCurrentComponentType().enComponentType.toLowerCase(), { current: column, cols: JSON.parse(JSON.stringify(this.activeColumns)) })
    this.setSortingParam()
    this.selectPage(0)
  }
  records: any[] = []

  selectPage(currentPage: number): void {
    this.records = []
    for (let index = (currentPage) * this.ROWNUM; index < (currentPage + 1) * this.ROWNUM && index < this.resultBuffer.length; index++) {
      this.records.push(this.preparedRows[index])
    }
    this.cdr.detectChanges()
  }

  onColumnsSelected(columns: string[]) {
    const noSpaces = Array.from(columns.filter((value) => value != undefined))
    const orig = Array.from(this.columns)
    const current = Array.from(this.activeColumns.current.filter((val) => {
      const match = noSpaces.find((newVal) => newVal == val)
      return match != null
    }))
    const diff = noSpaces.filter((newVal) => {
      const match = current.find((val) => newVal == val)
      return match == null
    }).reverse()
    for (const element of diff) {
      current.unshift(element)
    }
    this.activeColumns = {
      currentSpaces: Array.from(columns),
      current: current,
      orig: orig
    }
    this.selectedColumnsMap.set(this.cts.getCurrentComponentType().enComponentType.toLowerCase(), { current: this.activeColumns.current[0], cols: JSON.parse(JSON.stringify(this.activeColumns)) })
    this.setSortingParam()
    this.selectPage(0)
    this.cdr.detectChanges()
  }
  activeColumns: { currentSpaces: string[], current: string[], orig: string[] } = { currentSpaces: [], current: [], orig: [] }

  resultBuffer: any[] = []
  search(event: any): void {
    let value: string = event.target.value
    this.resultBuffer = []
    this.all.forEach((item: any) => {
      if (this.include(item, value.replaceAll(' ', ''))) {
        this.resultBuffer.push(item)
      }
    })
    // this.setQuery(new Map().set('page', 0), 'merge').then(() => {
    //   this.selectPage(0)
    // })
    this.selectPage(0)
  }
  homoglyphsArray: any[] = [
    { ru: 'а', en: 'a' },
    { ru: 'к', en: 'k' },
    { ru: 'm', en: 'м' },
    { ru: 'е', en: 'e' },
    { ru: 'о', en: 'o' },
    { ru: 'с', en: 'c' },
    { ru: 'р', en: 'p' },
    { ru: 'х', en: 'x' },
  ];

  include(item: any, value: string): boolean {
    let paramValue: string = `${item[this.sortParam]}`.replaceAll(' ', '')
    let length: number = paramValue.length >= value.length ? value.length : paramValue.length
    let extractedPart = paramValue.slice(0, length).split('')
    for (let i = 0; i < extractedPart.length; i++) {
      if (value[i].toLowerCase() !== extractedPart[i].toLowerCase()) {
        let recognizedRu = this.homoglyphsArray.find(char => char.ru == value[i].toLowerCase() && char.en == extractedPart[i].toLowerCase())
        if (recognizedRu) {
          break;
        }
        let recognizedEn = this.homoglyphsArray.find(char => char.en == value[i].toLowerCase() && char.ru == extractedPart[i].toLowerCase())
        if (recognizedEn) {
          break;
        }
        return false
      }
    }
    return true;
  }
}
