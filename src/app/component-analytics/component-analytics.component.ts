import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NavigatorComponent } from "../components/navigator/navigator.component";
import { LoaderComponent } from "../components/loader/loader.component";
import { NgIf, NgStyle } from '@angular/common';
import { ParameterSortingComponent } from "../components/parameter-sorting/parameter-sorting.component";
import { ParameterValueCountTableComponent } from "../components/parameter-value-count-table/parameter-value-count-table.component";
import { combineLatest, forkJoin } from 'rxjs';
import { ApiService } from '../../services/api.services1';
import { ComponentTypes, IObsHandlers } from '../../utils/types/app';
import { HttpClientModule } from '@angular/common/http';
import { isException } from '../../utils/static-data/filter-exceptions';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectListComponent } from "../components/select-list/select-list.component";
import { DomSanitizer } from '@angular/platform-browser';
import { ChartTemplateComponent } from "../components/charts/chart_template.component";
import { chartNamesMap } from '../../utils/static-data/chart-names';

@Component({
  selector: 'app-component-analytics',
  imports: [HttpClientModule, NavigatorComponent, LoaderComponent, NgStyle, ParameterValueCountTableComponent, SelectListComponent, ChartTemplateComponent],
  providers: [ApiService],
  templateUrl: './component-analytics.component.html',
  styleUrl: './component-analytics.component.css'
})



export class ComponentAnalyticsComponent implements OnInit, OnChanges {
  onChartNameSelected(alias: string) {
    this.currentChartNameAlias = alias
    const index = this.chartNamesAlias.findIndex((val) => val == alias)
    this.currentChartName = this.chartNames[index]
  }
  onColumnValueChanged(value: string) {
    this.currentPropNameValue = `${value}`
  }

  loader!: boolean
  ruComponentType!: string
  columns: string[] = []
  columnAlias: string[] = []
  currentChartNameAlias!: string | undefined
  currentChartName!: string | undefined
  chartNames: string[] = []
  chartNamesAlias: string[] = []
  mainChartQuery: Map<string, string> = new Map()
  panelChartQuery: Map<string, string> = new Map()
  @Input()
  hideNavigation!: boolean
  @Input()
  enComponentType!: string | undefined
  @Input()
  all!: any[]
  @Input()
  alias!: Map<string, string>
  @Input()
  componentTypes!: ComponentTypes[]
  @Input()
  storage: any
  constructor(
    private route: ActivatedRoute,
    private api: ApiService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    const filteredObs = this.initObs()
    if (filteredObs.length) {
      this.getApi(filteredObs)
    }
    else {
      this.initData()
    }
  }

  ngOnInit(): void {
    this.chartNames = Array.from(chartNamesMap.keys())
    this.chartNamesAlias = Array.from(chartNamesMap.values())
    this.currentChartName = this.chartNames[0]
    this.currentChartNameAlias = chartNamesMap.get(this.currentChartName!)!
    const filteredObs = this.initObs()
    if (filteredObs.length) {
      this.getApi(filteredObs)
    }
  }

  getApi(filteredObs: IObsHandlers[]): void {
    this.loader = true
    const processes = filteredObs.map((val) => val.process)
    const observables = filteredObs.map((val) => val.observable)
    combineLatest(observables).subscribe((res: any) => {
      for (let index = 0; index < processes.length; index++) {
        processes[index](res[index])
      }
      this.initData()
    });
  }

  initData(): void {
    if (this.enComponentType && this.storage) {
      this.all = this.storage[this.enComponentType.toLowerCase()]
      const sample = this.all[0]
      this.columns = []
      this.columnAlias = []
      for (const key in sample) {
        if (!isException(key)) {
          this.columns.push(key)
          this.columnAlias.push(this.alias.get(key)!)
        }
      }
      this.ruComponentType = this.getRuComponentTypeByEn(this.enComponentType!)!
      this.onColumnSelected(this.columnAlias[0])
      this.onColumnValueChanged(sample[this.currentPropName])
      this.buildMainChart()
      this.buildPanelChart()
    }
    this.loader = false
  }

  initObs(): IObsHandlers[] {
    const obs: IObsHandlers[] = [
      {
        process: ((params: any) => {
          if (params.get('ruComponentType'))
            this.enComponentType = params.get('ruComponentType')
        }),
        observable: this.route.paramMap,
      },
      {
        process: ((res: any) => {
          this.storage = res
        }),
        observable: this.api.getComponentsApiAll(),
      },
      {
        process: ((res: any) => { this.alias = new Map(Object.entries(res)) }),
        observable: this.api.getAlias(),
      },
      {
        process: ((res: any) => { this.componentTypes = res }),
        observable: this.api.getComponentNames(),
      }
    ]
    const obsV = [this.enComponentType, this.storage, this.alias, this.componentTypes]
    const filteredObs = obs.filter((val, index) => obsV[index] === undefined)
    return filteredObs
  }

  getRuComponentTypeByEn(enComponentType: string): string | undefined {
    let ruComponentType
    for (const element of this.componentTypes) {
      if (element.enComponentType.toLowerCase() === enComponentType.toLowerCase()) {
        ruComponentType = element.ruComponentType
      }
    }
    return ruComponentType
  }

  buildMainChart(): void {
    this.mainChartQuery = new Map()
    this.mainChartQuery.set("all", "1")
    this.mainChartQuery.set("param", this.currentPropName)
    this.mainChartQuery.set("ruComponentType", this.ruComponentType!)
    this.mainChartQuery.set("alias", this.alias.get(this.currentPropName)!)
  }

  buildPanelChart(): void {
    this.panelChartQuery = new Map()
    this.panelChartQuery.set("all", "1")
    this.panelChartQuery.set("param", this.currentPropName)
    this.panelChartQuery.set("ruComponentType", this.ruComponentType!)
    this.panelChartQuery.set("paramValue", this.currentPropNameValue!)
  }

  currentPropName!: string
  currentPropNameValue!: string
  onColumnSelected(column: string) {
    const index = this.columnAlias.findIndex((val) => val == column)
    this.currentPropName = this.columns[index]
  }
}
