import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ApiService1 } from '../../../services/api.services1';
import { AppEnum, ComponentTypeRuEnum } from '../../../utils/enum/app.enum';
import { ComponentOptions } from '../../../utils/types/app';
import { HttpClientModule } from '@angular/common/http';
import { Location, NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { chartNamesMap, columnsMax, columnsMin, prioritySchemaWrapper2Map, propsMap } from '../../../assets/fetch.config';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigatorComponent } from '../../components/navigator/navigator.component';
import { LoaderComponent } from '../../components/loader/loader.component';

@Component({
  selector: 'app-table',
  imports: [HttpClientModule, NgFor, NgClass, NavigatorComponent, LoaderComponent, NgStyle, NgIf],
  providers: [ApiService1],
  templateUrl: './table-page.component.html',
  styleUrls: ['./table-page.component.css', '../../components/selection/selection.css', '../../components/styles/tabs.css', '../../components/styles/button.css']
})
export class TablePage implements OnInit {
  storage: any;
  allias!: Map<string, string>;
  all!: Partial<ComponentOptions>[];
  selectedRuComponentType!: string
  loader!: boolean
  error!: string
  iconName!: 'not_found'
  records!: any[]
  mainChartUrl!: any
  chartNames!: string[]
  priority!: string
  priorities!: string[]
  columns!: string[]
  prioritySchemaWrapper2Map!: any
  activatedColumns!: any[]
  url!: string
  save!: boolean
  constructor(
    private route: ActivatedRoute,
    private api: ApiService1,
    private location: Location,
    private router: Router
  ) {
    this.allias = new Map()
    this.records = []
    this.all = []
    this.columns = []
    this.activatedColumns = []
    this.storage = new Map()
    this.loader = true
  }

  ngOnInit(): void {
    this.prioritySchemaWrapper2Map = prioritySchemaWrapper2Map
    this.chartNames = Array.from(chartNamesMap.keys())

    this.priorities = this.getPriorityArrayFromQuery()
    this.priority = this.getSavedPriorityFromStorage() as string
    if (this.priority === undefined) {
      this.priority = AppEnum.ALL
      if (this.priorities.length) {
        this.priority = this.priorities[this.priorities.length - 1]
      }
      this.save = true
    }
    else {
      this.save = false
    }
    const query = new Map(Object.entries((this.route.snapshot.queryParamMap as any).params));
    this.getApi(query)
  }

  getSavedPriorityFromStorage(): string | undefined {
    const selection = JSON.parse(window.localStorage.getItem('selection') as string)
    if (selection && selection.priority) {
      return selection.priority
    }
    return undefined
  }

  changePriorityInStorage(priority: string): void {
    if (!this.isStorageEmpty()) {
      console.log(window.localStorage.getItem('selection') as string)
      const selection = JSON.parse(window.localStorage.getItem('selection') as string)
      // window.localStorage.setItem('selection', JSON.stringify(selection))
      this.save = (priority !== selection.priority)
    }
    else {
      this.save = true
    }

  }

  onStateChange(): void {
    this.save = !this.save
    this.save ? this.resetStorage() : this.saveToStorage()
  }

  getPriorityArrayFromQuery(): string[] {
    const priorities: string[] = []
    const queryObj = (this.route.snapshot.queryParamMap as any).params
    for (const key in queryObj) {
      if (propsMap.get(key) && key !== 'ruComponentType') {
        priorities.push(key)
      }
    }
    return priorities
  }

  getChartAllias(name: string): string {
    return chartNamesMap.get(name) as string
  }

  onChartUrlChnaged(type: string): string {
    let mainUrl = `/chart/components/ruComponentType/${type}`
    return this.makeQueryStr(mainUrl)
  }

  makeQueryStr(url: string): string {
    const queryObj = (this.route.snapshot.queryParamMap as any).params
    this.activatedColumns = []
    url += "?"
    for (const key in queryObj) {
      url += `${key}=${queryObj[key]}&`
      let map = new Map().set(key, queryObj[key])
      this.activatedColumns.push(Object.fromEntries(map))
      if (key == this.priority) {
        break
      }
    }
    if (this.selectedRuComponentType) {
      url += `ruComponentType=${prioritySchemaWrapper2Map.get(this.selectedRuComponentType)}`
    }

    url = url.replace('+', '%2B0')
    return url
  }

  findInColumnsMax(column: string): number {
    return columnsMax.findIndex((value, index) => value === column)
  }

  findInColumnsMin(column: string): number {
    return columnsMin.findIndex((value, index) => value === column)
  }

  getApi(query: Map<string, any>): void {

    forkJoin([
      this.api.getComponentsApiAllWithProirityLevels(query),
      this.api.getAlias()
    ])
      .subscribe(res => {
        this.storage = res[0] as any
        const allias = (res as any[])[1]
        this.allias = new Map<string, string>(Object.entries(allias))
        const value = this.getFirstRuComponentType()
        if (value) {
          this.selectedRuComponentType = value
        }
        this.initColumns()
        this.loader = false
      });
  }


  getFirstRuComponentType(): string | undefined {
    const object = Object.fromEntries(this.storage)
    for (const key in object) {
      return key
    }
    return undefined
  }
  getKeyArrayFromStorage(): string[] {
    const object = Object.fromEntries(this.storage)
    const keys = []
    for (const key in object) {
      keys.push(key)
    }
    return keys;
  }
  onRuComponentTypeSelected(ruComponentType: any): void {
    this.selectedRuComponentType = ruComponentType
    this.initColumns()
  }
  initColumns(): void {
    let columns = []
    this.initRows()
    let obj = {}
    if (this.all) {
      obj = this.all[0]
    }
    for (const key in obj) {
      let allias = this.allias.get(key)
      if (allias) {
        columns.push(allias)
      }
      else {
        columns.push(key)
      }
    }
    this.columns = columns
  }

  getArraFromLastIndex(last: number): number[] {
    let res = []
    for (let index = 1; index <= last; index++) {
      res.push(index)
    }
    return res
  }

  initRows(): void {
    let rows = []
    try {
      rows = (this.storage.get(this.selectedRuComponentType)).get(this.priority)
      this.all = rows
    }
    catch { }
  }
  getRecordsFromObjAsArray(object: any): string[] {
    const values = []
    for (const key in object) {
      values.push(object[key] ?? "null")
    }
    return values
  }

  saveToStorage(): void {
    let obj: any = {}
    for (const type of ['mixed', 'bar', 'pie', 'donut']) {
      obj[type] = this.onChartUrlChnaged(type)
    }
    window.localStorage.setItem('selection', JSON.stringify({
      tableUrl: this.location.path(),
      chartPages: obj,
      priority: this.priority
    }))
  }

  resetStorage(): void {
    window.localStorage.removeItem('selection')
  }

  isStorageEmpty(): boolean {
    return window.localStorage.getItem('selection') === null
  }

  back(): void {
    this.router.navigateByUrl("/table-builder")
  }
}
