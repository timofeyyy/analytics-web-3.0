import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ApiService1 } from '../../../services/api.services1';
import { AppEnum, ComponentTypeRuEnum } from '../../../utils/enum/app.enum';
import { ComponentOptions } from '../../../utils/types/app';
import { HttpClientModule } from '@angular/common/http';
import { NgClass, NgFor, NgIf, NgStyle } from '@angular/common';
import { NavigatorComponent } from "../navigator/navigator.component";
import { LoaderComponent } from "../loader/loader.component";
import { ManufacturerCountTableComponent } from "../manufacturer-count-table/manufacturer-count-table.component";
import { chartNamesMap, columnsMax, columnsMin, prioritySchemaWrapperMap } from '../../../assets/fetch.config';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-table',
  imports: [HttpClientModule, NgFor, NgClass, NavigatorComponent, LoaderComponent, NgStyle, NgIf, ManufacturerCountTableComponent],
  providers: [ApiService1],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css', '../selection/selection.css']
})
export class TableComponent implements OnInit {
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
    // const queryObj = (this.route.snapshot.queryParamMap as any).params
    // for (const key in queryObj) {

    // }
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

  // getApi(query: Map<string, any>): void {

  //   forkJoin([
  //     this.api.getComponentsApiAll(query),
  //     this.api.getAlias()
  //   ])
  //     .subscribe(res => {
  //       this.storage.set(ComponentTypeRuEnum.DIOD, (res as any[])[0]["diods"])
  //       this.storage.set(ComponentTypeRuEnum.TRANSISTOR, (res as any[])[0]["transistors"])
  //       this.storage.set(ComponentTypeRuEnum.CAPACITOR, (res as any[])[0]["capacitors"])
  //       this.storage.set(ComponentTypeRuEnum.MICROCHIP, (res as any[])[0]["microchips"])
  //       this.storage.set(ComponentTypeRuEnum.RESISTOR, (res as any[])[0]["resistors"])

  //       this.records = [
  //         ...this.storage.get(ComponentTypeRuEnum.DIOD),
  //         ...this.storage.get(ComponentTypeRuEnum.TRANSISTOR),
  //         ...this.storage.get(ComponentTypeRuEnum.CAPACITOR),
  //         ...this.storage.get(ComponentTypeRuEnum.MICROCHIP),
  //         ...this.storage.get(ComponentTypeRuEnum.RESISTOR),
  //       ]
  //       const allias = (res as any[])[1]
  //       this.allias = new Map<string, string>(Object.entries(allias))
  //       const value = this.getFirstRuComponentType()
  //       if (value) {
  //         this.selectedRuComponentType = value
  //         this.columns = this.initColumns(value)
  //       }
  //       if (!this.columns.length) {
  //         this.error = "Ничего не найдено"
  //         this.iconName = "not_found"
  //       }
  //       this.loader = false
  //     });
  // }

  getApi(query: Map<string, any>): void {

    forkJoin([
      this.api.getComponentsApiAllWithProirityLevels(query),
      this.api.getAlias()
    ])
      .subscribe(res => {
        this.storage = res[0] as any

        // this.initRows()


        // let microchipsArr = srotageMap.get(microchips as string)
        // let diodsArr = srotageMap.get(diods as string)
        // let transistorsArr = srotageMap.get(transistors as string)
        // let capacitorsArr = srotageMap.get(capacitors as string)
        // let resistorsArr = srotageMap.get(resistors as string)

        // this.storage.set(ComponentTypeRuEnum.MICROCHIP, microchipsArr)
        // this.storage.set(ComponentTypeRuEnum.DIOD, diodsArr)
        // this.storage.set(ComponentTypeRuEnum.TRANSISTOR, transistorsArr)
        // this.storage.set(ComponentTypeRuEnum.CAPACITOR, capacitorsArr)
        // this.storage.set(ComponentTypeRuEnum.RESISTOR, resistorsArr)
        // if (Array.isArray(this.storage.get(ComponentTypeRuEnum.DIOD))) {
        //   this.records = [
        //     ...this.storage.get(ComponentTypeRuEnum.DIOD),
        //     ...this.storage.get(ComponentTypeRuEnum.TRANSISTOR),
        //     ...this.storage.get(ComponentTypeRuEnum.CAPACITOR),
        //     ...this.storage.get(ComponentTypeRuEnum.MICROCHIP),
        //     ...this.storage.get(ComponentTypeRuEnum.RESISTOR),
        //   ]
        // }
        // else {

        // }

        const allias = (res as any[])[1]
        this.allias = new Map<string, string>(Object.entries(allias))
        const value = this.getFirstRuComponentType()
        if (value) {
          this.selectedRuComponentType = value
          // this.initColumns()
        }
        this.initColumns()

        // this.getKeyArrayFromStorage()

        // this.initRows()
        // if (!this.columns.length) {
        //   this.error = "Ничего не найдено"
        //   this.iconName = "not_found"
        // }
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
    this.columns
  }

  initRows(): void {
    let rows = []
    try {
      rows = (this.storage.get(this.selectedRuComponentType)).get(this.priority)
      console.log((this.storage.get(this.selectedRuComponentType)), this.priority, rows)
      this.all = rows

    }
    catch {

    }

  }



  getRecordsFromObjAsArray(object: any): string[] {
    const values = []
    for (const key in object) {
      values.push(object[key] ?? "null")
    }
    return values
  }
}
