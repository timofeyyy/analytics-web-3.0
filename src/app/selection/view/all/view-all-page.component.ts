import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ApiService1 } from '../../../../services/api.services1';
import { AppEnum, ComponentTypeRuEnum } from '../../../../utils/enum/app.enum';
import { ComponentOptions } from '../../../../utils/types/app';
import { HttpClientModule } from '@angular/common/http';
import { Location, NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { propsMap } from '../../../fetch.config';
import { NavigatorComponent } from '../../../components/navigator/navigator.component';
import { LoaderComponent } from '../../../components/loader/loader.component';
import { componentStorage, fetchComponentTypes, initComponentTypes } from '../../../../utils/redux/component';
import { columnsMax, columnsMin } from '../../../../utils/static-data/compared-min-max';
import { chartNamesMap } from '../../../../utils/static-data/chart-names';

@Component({
  selector: 'app-table',
  imports: [HttpClientModule, NgFor, NgClass, NavigatorComponent, LoaderComponent, NgStyle, NgIf],
  providers: [ApiService1],
  templateUrl: './view-all-page.component.html',
  styleUrls: ['./view-all-page.component.css', '../../../components/styles/tabs.css', '../../../components/styles/button.css']
})
export class SelectionViewAllPage implements OnInit {
  storage: any;
  allias!: Map<string, string>;
  all!: Partial<ComponentOptions>[];
  selectedEnComponentType!: string
  loader!: boolean
  error!: string
  iconName!: 'not_found'
  records!: any[]
  mainChartUrl!: any
  chartNames!: string[]
  // priority!: string
  // priorities!: string[]
  columns!: string[]
  prioritySchemaWrapper2Map!: any
  activatedColumns!: any[]
  url!: string
  save!: boolean
  currentPath!: string
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
    componentStorage.dispatch(initComponentTypes())
    if (!Object.entries(componentStorage.getState().componentTypes).length) {
      componentStorage.dispatch(fetchComponentTypes(this.api));
    }
    const componentTypes: any[] = componentStorage.getState().componentTypes
    const componentTypesObj: any = {}
    componentTypes.forEach(val => {
      const enComponentType = val['enComponentType'].toLowerCase()
      const ruComponentType = val['ruComponentType'].toLowerCase()
      componentTypesObj[enComponentType] = ruComponentType
    })
    this.prioritySchemaWrapper2Map = new Map(Object.entries(componentTypesObj))
    this.chartNames = Array.from(chartNamesMap.keys())
    // this.currentPath = `/${this.location.path().split('/')[1]}`
    // this.priorities = this.getPriorityArrayFromQuery()
    // if (this.priority === undefined) {
    //   this.priority = AppEnum.ALL
    //   if (this.priorities.length) {
    //     this.priority = this.priorities[this.priorities.length - 1]
    //   }
    //   this.save = true
    // }
    // else {
    //   this.save = false
    // }
    const query = new Map(Object.entries((this.route.snapshot.queryParamMap as any).params));
    this.getApi(query)
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
        console.log(res)
        this.storage = res[0] as any
        console.log(this.storage)
        const allias = (res as any[])[1]
        this.allias = new Map<string, string>(Object.entries(allias))
        console.log(this.all)

        const value = this.getFirstRuComponentType()
        if (value) {
          this.selectedEnComponentType = value
        }

        this.initColumns()
        this.loader = false
        console.log(this.all)
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
    this.selectedEnComponentType = ruComponentType
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
      rows = (this.storage.get(this.selectedEnComponentType)).get(AppEnum.ALL)
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

  back(): void {
    this.router.navigateByUrl("/selection-builder")
  }
}
