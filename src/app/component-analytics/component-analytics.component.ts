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
  selector: 'app-component-analytics',
  imports: [HttpClientModule, NavigatorComponent, LoaderComponent, NgStyle, ParameterValueCountTableComponent, SelectListComponent, ChartTemplateComponent, NgIf],
  providers: [ApiService, ComponentTypeService],
  templateUrl: './component-analytics.component.html',
  styleUrl: './component-analytics.component.css'
})

export class ComponentAnalyticsComponent implements OnInit, OnChanges {
  onSortDirectionChanged(entry: [string, string]) {
    this.sortParam =entry[0]
    this.sortDirectopn =entry[1]
  }
  manufacturerName!: string
  onManufacturerSelected($event: string) {
    this.all = this.storage[this.componentType.enComponentType.toLowerCase()].filter((item: any) => item['manufacturerName'] == $event || $event == AppEnum.ALL)
    console.log(this.all.length)
    if (this.pvct) {
      this.pvct.initOriginalRecords(this.all)
    }
    this.manufacturerName = $event
  }

  onChartNameSelected(alias: string) {
    this.currentChartNameAlias = alias
    const index = this.chartNamesAlias.findIndex((val) => val == alias)
    this.currentChartName = this.chartNames[index]
  }
  onColumnValueChanged(value: string) {
    this.currentPropNameValue = `${value}`
  }

  loader!: boolean
  columns: string[] = []
  columnAlias: string[] = []
  currentChartNameAlias!: string | undefined
  currentChartName!: string | undefined
  chartNames: string[] = []
  chartNamesAlias: string[] = []
  mainChartQuery!: Map<string, string>
  @ViewChild(ParameterValueCountTableComponent)
  pvct!: ParameterValueCountTableComponent;
  @Input()
  hideNavigation!: boolean
  @Input()
  componentType!: ComponentTypes
  @Input()
  all!: any[]
  @Input()
  alias!: Map<string, string>
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
      console.log(this.chartSectionName, this.removeOnChange)
    }
  }

  ngOnInit(): void {
    this.chain()
  }


  chain(): void {
    this.loader = true
    of(null).pipe(
      concatMap(() => {
        // console.log(this.storage['microchip'].length)
        if (this.componentType) {
          return of(this.componentType)
        }
        return this.api.getComponentNames().pipe(
          concatMap((types: ComponentTypes[]) => {
            this.cts.setComponentTypes(types)
            return this.route.paramMap
          }),
          concatMap((params: any) => {
            let componentType
            if (params.get('enComponentType')) {
              componentType = this.cts.getComponentTypeByEn(params.get('enComponentType'));
              this.cts.setCurrentComponentType(componentType!)
            }

            return of(componentType)
          })
        )
      }),
      concatMap((componentType: ComponentTypes | undefined) => {
        if (componentType) {
          this.componentType = componentType
        }
        if (this.storage) {
          return of(this.storage)
        }
        return this.api.getComponentsApiAll()
      }),
      concatMap((res: any) => {
        // console.log(res, "-------------------------------")
        if (!this.storage) {
          this.storage = res
        }
        if (this.alias) {
          return of(Object.fromEntries(this.alias.entries()))
        }
        return this.api.getAlias()
      }
      ),
      concatMap((alias: { [column: string]: string }) => {
        this.alias = new Map(Object.entries(alias))
        return of(null)
      })
    ).subscribe(() => {
      if (!this.chartNames.length) {
        this.chartNames = Array.from(chartNamesMap.keys())
        this.currentChartName = this.chartNames[0]
      }
      if (!this.chartNamesAlias.length) {
        this.chartNamesAlias = Array.from(chartNamesMap.values())
        this.currentChartNameAlias = chartNamesMap.get(this.currentChartName!)!
      }
      this.initData()
      if (this.pvct) {
        this.pvct.initOriginalRecords(this.all)
      }
      this.loader = false
    })
  }
  manufacturers: string[] = []
  
  initData(): void {

    if (this.componentType && this.storage) {
      this.all = this.storage[this.componentType.enComponentType.toLowerCase()]

      this.manufacturers = []
      this.manufacturers.push(AppEnum.ALL)
      for (const item of this.all) {
        const manufacturerName = item['manufacturerName']
        if (!this.manufacturers.includes(manufacturerName)) {
          this.manufacturers.push(manufacturerName)
        }
      }
      const sample = this.all[0]
      this.columns = []
      this.columnAlias = []
      for (const key in sample) {
        if (!isException(key)) {
          this.columns.push(key)
          this.columnAlias.push(this.alias.get(key)!)
        }
      }
      if (!this.currentPropName) {
        this.onColumnSelected(this.columnAlias[0])
      }
      this.onColumnValueChanged(sample[this.currentPropName])
      this.buildMainChart()
    }
    this.loader = false
  }
  @Input()
  xLabelsSize: string = "max(0.8vw, 8px)"
  @Input()
  yLabelsSize: string = "0.7vw"
  @Output()
  onChartChange: EventEmitter<any> = new EventEmitter()
  sortParam: string = AppEnum.AMOUNT
  sortDirectopn: string = AppEnum.ASC
  buildMainChart(): void {
    // .set('bar-x-labels', '1')
    // console.log(this.storage, this.componentType.enComponentType.toLowerCase())
    const amount = this.storage[this.componentType.enComponentType.toLowerCase()].length
    this.mainChartQuery = new Map()
      .set("all", "1")
      .set('x-labels-size', this.xLabelsSize)
      .set('y-labels-size', this.yLabelsSize)
      .set("param", this.currentPropName)
      .set("enComponentType", this.componentType.enComponentType!)
      .set("alias", this.alias.get(this.currentPropName)!)
      .set("manufacturerName", this.manufacturerName)
      .set("amount", amount)
      .set("sortParam", this.sortParam).set("sortDirectopn", this.sortDirectopn)
    // console.log(this.storage)
    this.onChartChange.emit({
      mainChartQuery: this.mainChartQuery,
      chartName: this.chartSectionName,
      reqName: 'components',
      typeName: 'bar',
      chartLabel: `Количественная статистика параметра ${this.alias.get(this.currentPropName)} из числа
                        компонентов (${amount} шт)`
    })
  }


  currentPropName!: string
  currentPropNameValue!: string
  onColumnSelected(column: string) {
    const index = this.columnAlias.findIndex((val) => val == column)
    this.currentPropName = this.columns[index]
    if (this.pvct && this.currentPropName) {
      this.pvct.parameter = this.currentPropName
      this.pvct.parameterAlias = this.alias.get(this.currentPropName)!
      this.pvct.initOriginalRecords(this.all)
    }
  }
}
