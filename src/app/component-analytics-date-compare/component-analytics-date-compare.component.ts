import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NavigatorComponent } from "../components/navigator/navigator.component";
import { LoaderComponent } from "../components/loader/loader.component";
import { NgIf, NgStyle } from '@angular/common';
import { ParameterSortingComponent } from "../components/parameter-sorting/parameter-sorting.component";
import { ParameterValueCountTableComponent } from "../components/parameter-value-count-table/parameter-value-count-table.component";
import { combineLatest, concatMap, forkJoin, map, of } from 'rxjs';
import { ApiService } from '../../services/api.services';
import { ComponentTypes, IObsHandlers } from '../../utils/types/app';
import { HttpClientModule } from '@angular/common/http';
import { isException } from '../../utils/static-data/filter-exceptions';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectListComponent } from "../components/select-list/select-list.component";
import { DomSanitizer } from '@angular/platform-browser';
import { ChartTemplateComponent } from "../components/charts/chart-template.component";
import { chartNamesMap } from '../../utils/static-data/chart-names';
import { ComponentTypeService } from '../../services/component-type.service';
import { Observable } from '@reduxjs/toolkit';
import { AppEnum } from '../../utils/enum/app.enum';

@Component({
  selector: 'app-component-analytics-date-compare',
  imports: [HttpClientModule, NavigatorComponent, LoaderComponent, NgStyle, SelectListComponent, ChartTemplateComponent, NgIf],
  providers: [ApiService, ComponentTypeService],
  templateUrl: './component-analytics-date-compare.component.html',
  styleUrl: './component-analytics-date-compare.component.css'
})

export class ComponentAnalyticsDateCompareComponent implements OnInit, OnChanges {
  onChartChanged(ruVal: string) {
    for (const [key, value] of chartNamesMap.entries()) {
      if (value == ruVal) {
        this.currentChart = key as 'bar' | 'sides'
      }
    }
  }
  componentTypes!: ComponentTypes[]
  componentTypeLabels!: string[]
  // currentComponentType!: ComponentTypes
  onComponentTypeSelected(RuComponentType: string) {
    this.cts.setCurrentComponentType(this.componentTypes.find(item => item.RuComponentType === RuComponentType)!)
    this.initData()
  }

  dataTypeState: 'date-compare' | 'date-compare-all' = 'date-compare-all'
  chartStates: string[] = [chartNamesMap.get('bar')!, chartNamesMap.get('sides')!]
  currentChart: 'bar' | 'sides' = 'bar'

  @Input()
  allowNull: boolean = false
  @Input()
  alias: Map<string, any> = new Map()
  // onSortDirectionChanged(entry: [string, string]) {
  //   this.sortParam = entry[0]
  //   this.sortDirectopn = entry[1]
  // }
  // ManufacturerName!: string
  // onManufacturerSelected($event: string) {
  //   this.all = this.storage[this.componentType.EnComponentType].filter((item: any) => item['ManufacturerName'] == $event || $event == AppEnum.ALL)
  //   if (this.pvct) {
  //     this.pvct.initOriginalRecords(this.all)
  //   }
  //   this.ManufacturerName = $event
  // }

  // onChartNameSelected(alias: string) {
  //   this.currentChartNameAlias = alias
  //   const index = this.chartNamesAlias.findIndex((val) => val == alias)
  //   this.currentChartName = this.chartNames[index]
  // }
  // onColumnValueChanged(value: string) {
  //   this.currentPropNameValue = `${value}`
  // }

  loader!: boolean
  // columns: string[] = []
  columnAlias: string[] = []
  // currentChartNameAlias!: string | undefined
  // currentChartName!: string | undefined
  // chartNames: string[] = []
  // chartNamesAlias: string[] = []
  mainChartQuery!: Map<string, string>
  // @ViewChild(ParameterValueCountTableComponent)
  // pvct!: ParameterValueCountTableComponent;
  @Input()
  hideNavigation!: boolean
  // @Input()
  // componentType!: ComponentTypes
  // @Input()
  // all!: any[]
  // @Input()
  // alias!: Map<string, string>
  @Input()
  storage: any
  @Input()
  chartSectionName: string = 'column'
  @Input()
  removeOnChange: boolean = true


  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private cts: ComponentTypeService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.removeOnChange) {
      this.chain()
    }
  }

  ngOnInit(): void {
    this.chain()
  }

  allColumns: any = {}
  dates1: string[] = []
  dates2: string[] = []
  currentDate1!: string
  currentDate2!: string


  chain(): void {
    of(null).pipe(
      concatMap(() => {
        // if (this.componentType) {
        //   return of(this.componentType)
        // }
        return this.api.getComponentNames()
        // .pipe(
        //   concatMap((types: ComponentTypes[]) => {
        // this.componentTypes = types
        // this.componentTypeLabels = this.componentTypes.map(item => item.RuComponentType)
        // this.cts.setComponentTypes(types)
        //     return this.route.paramMap
        //   })

        // )
      }),
      concatMap((types: ComponentTypes[]) => {
        this.componentTypes = types
        this.componentTypeLabels = this.componentTypes.map(item => item.RuComponentType)
        this.cts.setComponentTypes(types)
        this.cts.setCurrentComponentType(this.componentTypes[0])
        // if (componentType) {
        //   this.componentType = componentType
        // }
        // if (this.storage) {
        //   return of(this.storage)
        // }
        return this.api.getComponentsAll()
      }),
      concatMap((res: any) => {
        if (!this.storage) {
          this.storage = res
        }
        // if (this.alias) {
        //   return of(Object.fromEntries(this.alias.entries()))
        // }
        // return this.api.getAlias()
        return Object.entries(this.allColumns).length ? of(null) : this.api.getColumns()
      }
      ),
      // concatMap((alias: { [column: string]: string }) => {
      //   this.alias = new Map(Object.entries(alias))
      //   return Object.entries(this.allColumns).length ? of(null) : this.api.getColumns()
      // }),
      concatMap((res: any) => {
        if (res) {
          this.allColumns = res
        }
        return of(null)
      })
    ).subscribe(() => {
          this.loader = true

      // if (!this.chartNames.length) {
      //   this.chartNames = Array.from(chartNamesMap.keys())
      //   this.currentChartName = this.chartNames[0]
      // }
      // if (!this.chartNamesAlias.length) {
      //   this.chartNamesAlias = Array.from(chartNamesMap.values())
      //   this.currentChartNameAlias = chartNamesMap.get(this.currentChartName!)!
      // }

      this.initData()
      // if (this.pvct) {
      //   this.pvct.initOriginalRecords(this.all)
      // }
    })
  }
  // manufacturers: string[] = []

  initData(): void {
    // console.log(this.allColumns, this.cts.getCurrentComponentType())
    this.changeColumnsAlias(this.cts.getCurrentComponentType())
    this.changeDates("init")
    this.buildMainChart()
    this.loader = false

  }


  changeDates(state: "update" | "init") {
    this.dates1 = []
    this.dates2 = []
    const dates = Object.keys(this.storage[this.cts.getCurrentComponentType().EnComponentType])
    if (state == "init") {
      this.currentDate1 = dates[dates.length - 2]
      this.currentDate2 = dates[dates.length - 1]
    }
    for (const date of dates) {
      if (date != this.currentDate1) {
        this.dates2.push(date)
      }
      if (date != this.currentDate2) {
        this.dates1.push(date)
      }
    }
  }

  changeColumnsAlias(type: ComponentTypes): void {
    const typeColumns = this.allColumns[type.EnComponentType] as { ruVal: string, enVal: string }[]
    this.columnAlias = typeColumns.filter(type => !isException(type.enVal)).map(type => type.ruVal)
    this.onColumnSelected(this.columnAlias[0])
  }

  // initData(): void {

  //   if (this.componentType && this.storage) {
  //     this.all = this.storage[this.componentType.EnComponentType]

  //     this.manufacturers = []
  //     this.manufacturers.push(AppEnum.ALL)
  //     for (const item of this.all) {
  //       const ManufacturerName = item['ManufacturerName']
  //       if (!this.manufacturers.includes(ManufacturerName)) {
  //         this.manufacturers.push(ManufacturerName)
  //       }
  //     }
  //     const sample = this.all[0]
  //     this.columns = []
  //     this.columnAlias = []
  //     for (const key in sample) {
  //       if (!isException(key)) {
  //         this.columns.push(key)
  //         this.columnAlias.push(this.alias.get(key)!)
  //       }
  //     }
  //     if (!this.currentPropName) {
  //       this.onColumnSelected(this.columnAlias[0])
  //     }
  //     this.onColumnValueChanged(sample[this.currentPropName])
  //     this.buildMainChart()
  //   }
  //   this.loader = false
  // }
  @Input()
  xLabelsSize: string = "max(0.8vw, 8px)"
  @Input()
  yLabelsSize: string = "0.7vw"
  @Output()
  onChartChange: EventEmitter<any> = new EventEmitter()
  sortParam: string = AppEnum.AMOUNT
  sortDirectopn: string = AppEnum.ASC
  // chartData: [any, any][] = []

  buildMainChart(): void {
    console.log(this.currentPropName)
    // const dividedData = 
    // const amount = this.storage[this.componentType.EnComponentType].length
    this.mainChartQuery = new Map()
      .set("all", this.allowNull ? "1" : "0")
      .set('x-labels-size', this.xLabelsSize)
      .set('y-labels-size', this.yLabelsSize)
      .set("param", this.currentPropName)
      .set("alias-param", this.alias.get(this.currentPropName))
      .set("currentDate1", this.currentDate1)
      .set("currentDate2", this.currentDate2)
      .set("EnComponentType", this.cts.getCurrentComponentType().EnComponentType!)
      .set("RuComponentType", this.cts.getCurrentComponentType().RuComponentType!)
    //   // .set("alias", this.alias.get(this.currentPropName)!)
    //   // .set("ManufacturerName", this.ManufacturerName)
    //   .set("amount", amount)
    //   .set("sortParam", this.sortParam).set("sortDirectopn", this.sortDirectopn)
    // // // // console.log(this.storage)
    // // // console.log(this,this.mainChartQuery)
    // this.onChartChange.emit({
    //   mainChartQuery: this.mainChartQuery,
    //   chartName: this.chartSectionName,
    //   reqName: 'components',
    //   typeName: 'bar',
    //   // chartLabel: `Количественная статистика параметра "${this.alias.get(this.currentPropName)}" из числа
    //   //                   компонентов (${amount} шт)`
    // })

  }


  currentPropName!: string
  currentPropNameValue!: string
  onColumnSelected(name: string) {

    // const index = this.columnAlias.findIndex((val) => val == column)
    this.currentPropName = (Object.entries(this.allColumns[this.cts.getCurrentComponentType().EnComponentType]).find(column => (column[1] as { ruVal: string, enVal: string }).ruVal == name) as any)[1].enVal
    console.log(this.currentPropName)
    // if (this.pvct && this.currentPropName) {
    //   this.pvct.parameter = this.currentPropName
    //   this.pvct.parameterAlias = this.alias.get(this.currentPropName)!
    //   this.pvct.initOriginalRecords(this.all)
    // }
  }
}
