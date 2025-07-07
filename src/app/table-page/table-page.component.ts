import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ApiService1 } from '../../services/api.services1';
import { AppEnum, ComponentTypeRuEnum } from '../../utils/enum/app.enum';
import { ComponentOptions } from '../../utils/types/app';
import { HttpClientModule } from '@angular/common/http';
import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { chartNamesMap, columnsMax, columnsMin } from '../../assets/fetch.config';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigatorComponent } from '../components/navigator/navigator.component';
import { LoaderComponent } from '../components/loader/loader.component';
import { ManufacturerCountTableComponent } from '../components/manufacturer-count-table/manufacturer-count-table.component';

@Component({
  selector: 'app-table',
  imports: [HttpClientModule, NgFor, NgClass, NavigatorComponent, LoaderComponent, NgStyle, NgIf, ManufacturerCountTableComponent],
  providers: [ApiService1],
  templateUrl: './table-page.component.html',  
  styleUrls: ['./table-page.component.css', '../components/selection/selection.css', '../components/styles/tabs.css']
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
  type!: string
  chartNames!: string[]
  priority!: string
  priorities!: string[]
  columns!: string[]
  constructor(private router: Router, private route: ActivatedRoute, private api: ApiService1, private sanitizer: DomSanitizer, private cdref: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.chartNames = Array.from(chartNamesMap.keys())
    this.allias = new Map()
    this.records = []
    this.all = []
    this.columns = []
    this.priorities = this.getPriorityArrayFromQuery()
    this.storage = new Map()
    const query = new Map(Object.entries((this.route.snapshot.queryParamMap as any).params));
    this.loader = true
    this.priority = AppEnum.ALL
    this.getApi(query)
    this.onChartTypeChanged("mixed")
  }

  getPriorityArrayFromQuery(): string[] {
    const priorities: string[] = []
    const queryObj = (this.route.snapshot.queryParamMap as any).params
    for (const key in queryObj) {
      if (key !== 'ruComponentType') {
        priorities.push(key)
      }
    }
    return priorities
  }

  onPriorityChange(priority: string): void {
    this.priority = priority
    this.initColumns()
    this.onChartTypeChanged(this.type)
  }

  getChartAllias(name: string): string {
    return chartNamesMap.get(name) as string
  }

  onChartTypeChanged(type: string): void {
    this.type = type
    let mainUrl = `/chart/components/ruComponentType/${type}`
    this.mainChartUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.makeQueryStr(mainUrl)
    )
  }


  makeQueryStr(url: string): string {
    const queryObj = (this.route.snapshot.queryParamMap as any).params
    url += "?"
    for (const key in queryObj) {
      url += `${key}=${queryObj[key]}&`
      if (key == this.priority) {
        break
      }
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
        console.log(res)
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
    // console.log(object)
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

  initRows(): void {
    let rows = []
    try {
      rows = (this.storage.get(this.selectedRuComponentType)).get(this.priority)
      // console.log((this.storage.get(this.selectedRuComponentType)), this.priority, rows)
      this.all = rows
    }
    catch {}
  }



  getRecordsFromObjAsArray(object: any): string[] {
    const values = []
    for (const key in object) {
      values.push(object[key] ?? "null")
    }
    return values
  }
}
