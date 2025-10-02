import { ChangeDetectorRef, Component, OnInit, output } from '@angular/core';
import { NavigatorComponent } from "../../components/navigator/navigator.component";
import { LoaderComponent } from "../../components/loader/loader.component";
import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { SelectListComponent } from "../../components/select-list/select-list.component";
import { ApiService } from '../../../services/api.services1';
import { forkJoin } from 'rxjs';
import { AppEnum } from '../../../utils/enum/app.enum';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { isException } from '../../../utils/static-data/filter-exceptions';
import { SelectListCheckboxComponent } from "../../components/select-list-checkbox/select-list-checkbox.component";
import { ParameterSortingComponent } from "../../components/parameter-sorting/parameter-sorting.component";
import { ComponentTypes } from '../../../utils/types/app';
import { PageLabelsComponent } from "../../catalog/page-labels/page-labels.component";
import { propsMap } from '../../fetch.config';
import { QueryPageSettings } from '../../../services/query.settings.service';
import { CdkNoDataRow } from "@angular/cdk/table";
import { ComponentAnalyticsComponent } from "../../component-analytics/component-analytics.component";

@Component({
  selector: 'app-selection-main',
  imports: [HttpClientModule, NavigatorComponent, LoaderComponent, NgStyle, SelectListComponent, NgFor, NgClass, SelectListCheckboxComponent, ParameterSortingComponent, PageLabelsComponent, NgIf, ComponentAnalyticsComponent],
  providers: [ApiService, QueryPageSettings],
  templateUrl: './selection-main.component.html',
  styleUrls: ['./selection-main.component.css', '../../components/styles/button.css', '../../components/styles/categories.css', '../../components/styles/input.css']
})
export class SelectionMainComponent implements OnInit {
  openBuilderPage() {
    this.router.navigateByUrl("/selection-builder")
  }
  onSortValueSelected() {
    this.preparedRows = Array.from(this.resultBuffer.map((val) => this.getObjEntry(val)))
    this.selectPage(0)
  }


  ngOnInit(): void {
    this.querySettings.redirectSelectionPage().then(() => {
      const query = new Map(Object.entries((this.route.snapshot.queryParamMap as any).params));
      this.priorities = this.getPriorityArrayFromQuery()
      if (this.priority === undefined) {
        this.priority = AppEnum.ALL
        if (this.priorities.length) {
          this.priority = this.priorities[this.priorities.length - 1][0]
        }
      }
      this.getApi(query)
    })
  }

  getPriorityArrayFromQuery(): [string, string][] {
    const priorities: [string, string][] = []
    const queryObj = (this.route.snapshot.queryParamMap as any).params
    for (const key in queryObj) {
      if (propsMap.get(key) && key !== 'ruComponentType') {
        priorities.push([key, queryObj[key]])
      }
    }
    return priorities
  }

  chartView!: boolean
  mainAction!: AppEnum.ALL | AppEnum.LASTSAVED
  loader!: boolean
  storageAll!: Map<string, any>
  storageFiltered!: Map<string, any>
  alias!: Map<string, string>
  all: any[] = []
  columns: string[] = []
  selectedEnComponentType!: ComponentTypes
  sortParam!: string
  componentTypes!: ComponentTypes[]
  componentTypesActive: (ComponentTypes | undefined)[] = [];
  priority!: string
  priorities!: [string, string][]


  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private querySettings: QueryPageSettings
  ) { }
  storage = {}
  getApi(query: Map<string, any>): void {
    this.loader = true
    forkJoin([
      this.api.getComponentsApiAllWithProirityLevels(query),
      this.api.getAlias(),
      this.api.getComponentNames(),
      this.api.getComponentsApiAll()
    ])
      .subscribe((res: any) => {
        const alias = (res as any[])[1]
        this.alias = new Map<string, string>(Object.entries(alias))
        this.componentTypes = res[2] as any
        this.storageFiltered = res[0]
        this.storageAll = new Map(Object.entries(res[3]))
        this.storage = res[0]
        const object = Object.fromEntries(this.mainAction == AppEnum.ALL ? this.storageAll : this.storageFiltered)
        const components = Object.entries(object)
        let enComponentType = ''
        if (components.length) {
          enComponentType = components[0][0]
        }

        this.selectedEnComponentType = this.componentTypes.find((val: ComponentTypes) => val.enComponentType.toLowerCase() == enComponentType)!
        const isMain = !this.querySettings.isPrExists()

        if (!isMain) {
          this.selectionViewTypeOptionsIndex = 1
        }
        const type = isMain ? AppEnum.ALL : AppEnum.LASTSAVED
        this.onSelectionViewTypeChanged(type)
        this.loader = false
      });
  }
  onPrioritySelected(priority: string): void {
    this.priority = priority
  }
  preparedRows: [string, any][][] = [];
  initColumns(): void {
    let columns = []
    let rows = []
    let storage: Map<string, any>
    if (this.mainAction === AppEnum.ALL) {
      rows = (this.storageAll.get(this.selectedEnComponentType.enComponentType.toLowerCase()))
      storage = this.storageAll
      this.storage = Object.fromEntries(this.storageAll)
    }
    else {
      const first = this.storageFiltered.keys().next().value
      this.selectedEnComponentType = this.componentTypes.find(val => val.enComponentType.toLowerCase() == first)!
      rows = (this.storageFiltered.get(this.selectedEnComponentType.enComponentType.toLowerCase()).get(this.priority))
      storage = this.storageFiltered
      const storageTmp = Object.fromEntries(this.storageAll)
      storageTmp[this.selectedEnComponentType.enComponentType.toLowerCase()] = rows
      this.storage = storageTmp
    }
    this.componentTypesActive = []
    this.componentTypes.forEach((val, index) => {
      if (storage.get(val.enComponentType.toLowerCase())) {
        this.componentTypesActive.push(val)
      }
      else {
        this.componentTypesActive.push(undefined)
      }
    })
    this.all = rows
    this.resultBuffer = Array.from(this.all)
    const colsMap = this.selectedColumnsMap.get(this.selectedEnComponentType.enComponentType.toLowerCase())
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
        if (alias && !isException(key)) {
          columns.push(alias)
        }
      }
      this.activeColumns.current = Array.from(columns)
      this.activeColumns.currentSpaces = Array.from(columns)
      this.activeColumns.orig = Array.from(columns)
    }
    this.setSortingParam()
    this.columns = Array.from(columns)
    this.preparedRows = Array.from(this.all.map((val) => this.getObjEntry(val)))
    this.selectPage(0)
  }

  setSortingParam(): void {
    const first = this.activeColumns.current.find(val => val != undefined)
    const aliasObj = Object.fromEntries(this.alias)
    const key = Object.keys(aliasObj).find(key => aliasObj[key] == first)
    this.sortParam = key!
  }

  getKeyArrayFromStorage(): string[] {
    const object = Object.fromEntries(this.storageAll)
    const keys = []
    for (const key in object) {
      keys.push(key)
    }
    return keys;
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
  onRuComponentTypeSelected(enComponentType: any): void {
    this.selectedEnComponentType = enComponentType
    this.initColumns()
  }

  openSidePanel!: boolean
  selectionViewTypeOptions: string[] = [AppEnum.ALL, AppEnum.LASTSAVED]
  selectionViewTypeOptionsIndex: number = 0
  onSelectionViewTypeChanged(val: string): void {
    this.openSidePanel = (val != AppEnum.ALL)
    this.mainAction = val as any
    this.initColumns()
  }

  selectedColumnsMap: Map<string, { current: string, cols: { currentSpaces: string[], current: string[], orig: string[] } }> = new Map()
  onColumnSelected(column: string) {
    this.activeColumns.current.sort(function (a, b) {
      return a == column ? -1 : b == column ? 1 : 0;
    });

    this.selectedColumnsMap.set(this.selectedEnComponentType.enComponentType.toLowerCase(), { current: column, cols: JSON.parse(JSON.stringify(this.activeColumns)) })
    this.setSortingParam()
    this.selectPage(0)
  }
  records: any[] = []

  selectPage(currentPage: number): void {
    this.records = []
    for (let index = (currentPage) * 40; index < (currentPage + 1) * 40 && index < this.resultBuffer.length; index++) {
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
    this.selectedColumnsMap.set(this.selectedEnComponentType.enComponentType.toLowerCase(), { current: this.activeColumns.current[0], cols: JSON.parse(JSON.stringify(this.activeColumns)) })
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

  include(item: any, value: string): boolean {
    let paramValue: string = item[this.sortParam].replaceAll(' ', '')
    let length: number = paramValue.length >= value.length ? value.length : paramValue.length
    let extractedPart = paramValue.slice(0, length).split('')
    for (let i = 0; i < extractedPart.length; i++) {
      if (value[i].toLocaleLowerCase() !== extractedPart[i].toLocaleLowerCase()) {
        return false;
      }
    }
    return true;
  }
}
