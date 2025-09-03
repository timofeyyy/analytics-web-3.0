import { Component, OnInit } from '@angular/core';
import { NavigatorComponent } from '../components/navigator/navigator.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { NgClass, NgFor, NgStyle } from '@angular/common';
import { ApiService1 } from '../../services/api.services1';
import { forkJoin } from 'rxjs';
import { props } from '../fetch.config';
import { HttpClientModule } from '@angular/common/http';
import { componentStorage, fetchComponentTypes, initComponentTypes } from '../../utils/redux/component';
import { AngularSplitModule } from 'angular-split';
import { ParameterValueCountTableComponent } from "../components/parameter-value-count-table/parameter-value-count-table.component";
import { chartNamesMap } from '../../utils/static-data/chart-names';
import { isException } from '../../utils/static-data/filter-exceptions';

@Component({
  selector: 'app-component-template',
  imports: [NavigatorComponent, NgFor, HttpClientModule, NgClass, NgStyle, AngularSplitModule, ParameterValueCountTableComponent],
  providers: [ApiService1],
  templateUrl: './component_type_template.component.html',
  styleUrls: ['./component_type_template.component.css', '../components/styles/button.css', '../components/styles/tabs.css'],
})
export class TypeTemplateComponent implements OnInit {

  onTableRowSelected($event: string) {
    $event ? this.buildValueLineChart($event) : this.buildChart()
  }

  getBack() {
    this.router.navigateByUrl('home')
  }
  currentTableValue!: string | undefined
  type!: string | null
  chartUrl: any
  chartWidth: number = 85
  currentPropName!: string
  enComponentType!: string
  allias: Map<string, string> = new Map()
  displayedColumns: string[] = []
  dropBoxPropsMapConfig!: Map<string, any>
  chartName!: string
  chartNames!: string[]
  componentTypesMap: Map<string, { state: boolean }> = new Map()
  storage: Map<string, any> = new Map()
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private santizer: DomSanitizer,
    private api: ApiService1
  ) { }

  onDragEnd(event: any) {
    this.calculateChartWidth(event.sizes[1])
  }
  calculateChartWidth(size: number): void {
    const val = 5 - Math.floor(size / 10)
    this.chartWidth = 75 + val * 10
    console.log(val, this.chartWidth)
  }
  ngOnInit(): void {
    this.calculateChartWidth(20)
    const query: Map<string, string> = new Map(Object.entries((this.route.snapshot.queryParamMap as any).params))
    this.chartNames = Array.from(chartNamesMap.keys())
    this.allias = new Map()
    const dropBoxPropsClone: any = {};
    for (const [key, value] of Object.entries(props)) {
      dropBoxPropsClone[key] = { ...value };
    }
    this.dropBoxPropsMapConfig = new Map(Object.entries(dropBoxPropsClone));
    this.route.paramMap.subscribe(params => {
      this.enComponentType = params.get('ruComponentType')!.toLowerCase()
      componentStorage.dispatch(initComponentTypes())
      if (!Object.entries(componentStorage.getState().componentTypes).length) {
        componentStorage.dispatch(fetchComponentTypes(this.api));
      }
      const componentTypes: any[] = componentStorage.getState().componentTypes
      for (const element of componentTypes as [{ ruComponentType: string, enComponentType: string }]) {
        this.componentTypesMap.set(element.enComponentType.toLowerCase(), { state: element.enComponentType.toLowerCase() === this.enComponentType || !this.enComponentType ? true : false })
      }
      let chartName = query.get('chartName')
      if (this.enComponentType) {
        this.getApi()
        if (!chartName) {
          chartName = 'manufacturerName'
        }
        this.onColumnSelected(chartName)
        this.type = "bar"
        this.buildChart()
      }
    })
  }

  openClose(enComponentType: string): void {
    const componentType = this.componentTypesMap.get(enComponentType)
    if (componentType) {
      componentType.state = !componentType.state
    }
  }

  getApi(): void {
    forkJoin([
      this.api.getComponentsApiAll(),
      this.api.getAlias()
    ]).subscribe(res => {
      const tableColumns: Map<string, Map<string, string>> = new Map()
      this.storage = new Map()
      this.allias = new Map(Object.entries((res as any)[1]))
      for (const key in res[0]) {
        const set = (res[0] as any)[key]
        this.storage.set(key, set);
        if (set.length) {
          const item = set[0]
          const columnBuffer: string[] = []
          for (const key in item) {
            if (!isException(key)) {
              columnBuffer.push(key)
            }
          }
          tableColumns.set(set[0].enComponentType.toLowerCase(), new Map(columnBuffer.map((value) => [value, this.allias.get(value) as string])).set('manufacturerName', this.allias.get('manufacturerName') as string))
        }
      }
      this.allias = new Map<string, string>(Object.entries((res as any[])[1]))
      this.displayedColumns = Array.from(tableColumns.get(`${this.enComponentType}`)!.keys())

    });
  }

  onColumnSelected(column: string): void {
    this.currentPropName = column
    this.currentTableValue = undefined
    // console.log(this.currentTableValue)
  }

  buildChart(): void {
    const ruComponentType = this.getRuComponentTypeByEn(this.enComponentType)
    if (ruComponentType) {
      let url: string = `chart/components/column/${this.type}?ruComponentType=${ruComponentType}&param=${this.currentPropName}&all=1`
      this.chartUrl = this.santizer.bypassSecurityTrustResourceUrl(url)
    }
  }

  buildValueLineChart(value: string): void {
    const ruComponentType = this.getRuComponentTypeByEn(this.enComponentType)
    if (ruComponentType) {
      let url: string = `chart/components/column-value/line?ruComponentType=${ruComponentType}&param=${this.currentPropName}&paramValue=${value}&all=1`
      this.chartUrl = this.santizer.bypassSecurityTrustResourceUrl(url)
    }
  }

  getChartAllias(name: string): string {
    return chartNamesMap.get(name) as string
  }

  // getKeysMax(): string[] {
  //   let res: string[] = []
  //   if (this.statMax) {
  //     for (const key in this.statMax) {
  //       res.push(`${key}:\t${this.statMax[key]}`)
  //     }
  //   }
  //   return res
  // }
  // getKeysMin(): string[] {
  //   let res: string[] = []
  //   if (this.statMin) {
  //     for (const key in this.statMin) {
  //       res.push(`${key}:\t${this.statMin[key]}`)
  //     }
  //   }
  //   return res
  // }

  // getValues(): string[] {
  //   let res: string[] = []
  //   if (this.statMax) {
  //     for (const key in this.statMax) {
  //       res.push(this.statMax[key])
  //     }
  //   }
  //   return res
  // }
  // makeQueryStr(url: string): string {
  //   const queryObj = (this.route.snapshot.queryParamMap as any).params
  //   url += "?"
  //   for (const key in queryObj) {
  //     url += `${key}=${queryObj[key]}&`
  //   }
  //   url = url.replace('+', '%2B0')
  //   return url
  // }
  getRuComponentTypeByEn(enComponentType: string): string | undefined {
    const componentTypes: any = componentStorage.getState().componentTypes
    let ruComponentType
    for (const element of componentTypes as [{ ruComponentType: string, enComponentType: string }]) {
      if (element.enComponentType.toLowerCase() === enComponentType.toLowerCase()) {
        ruComponentType = element.ruComponentType
      }
    }
    return ruComponentType
  }
}

