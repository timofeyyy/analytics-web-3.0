import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavigatorComponent } from '../components/navigator/navigator.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { NgClass, NgFor, NgStyle } from '@angular/common';
import { ApiService } from '../../services/api.services1';
import { forkJoin } from 'rxjs';
import { props } from '../fetch.config';
import { HttpClientModule } from '@angular/common/http';
import { AngularSplitModule } from 'angular-split';
import { ParameterValueCountTableComponent } from "../components/parameter-value-count-table/parameter-value-count-table.component";
import { chartNamesMap } from '../../utils/static-data/chart-names';
import { isException } from '../../utils/static-data/filter-exceptions';
import { ComponentTypes } from '../../utils/types/app';

@Component({
  selector: 'app-component-template',
  imports: [NavigatorComponent, NgFor, HttpClientModule, NgClass, NgStyle, AngularSplitModule, ParameterValueCountTableComponent],
  providers: [ApiService],
  templateUrl: './component_type_template.component.html',
  styleUrls: ['./component-type-template.component.css', '../components/styles/button.css', '../components/styles/tabs.css'],
})
export class TypeTemplateComponent implements OnInit {

  onTableRowSelected($event: string) {
    this.currentTableValue = $event
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
  alias: Map<string, string> = new Map()
  displayedColumns: string[] = []
  dropBoxPropsMapConfig!: Map<string, any>
  chartName!: string
  chartNames!: string[]
  componentTypes: ComponentTypes[] = []
  componentTypesMap: Map<string, { state: boolean }> = new Map()
  storage: Map<string, any> = new Map()

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private santizer: DomSanitizer,
    private api: ApiService,
  ) {
  }

  onDragEnd(event: any) {
    this.calculateChartWidth(event.sizes[1])
  }
  calculateChartWidth(size: number): void {
    const val = 5 - Math.floor(size / 10)
    this.chartWidth = 75 + val * 10
  }
  ngOnInit(): void {
    this.calculateChartWidth(20)
    const query: Map<string, string> = new Map(Object.entries((this.route.snapshot.queryParamMap as any).params))
    this.chartNames = Array.from(chartNamesMap.keys())
    this.alias = new Map()
    const dropBoxPropsClone: any = {};
    for (const [key, value] of Object.entries(props)) {
      dropBoxPropsClone[key] = { ...value };
    }
    this.dropBoxPropsMapConfig = new Map(Object.entries(dropBoxPropsClone));
    this.route.paramMap.subscribe(params => {
      this.api.getComponentNames()?.subscribe(res => {
        this.enComponentType = params.get('ruComponentType')!.toLowerCase()
        console.log(this.enComponentType, params)
        this.componentTypes = res
        for (const element of res) {
          console.log(res)
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
      this.alias = new Map(Object.entries((res as any)[1]))
      
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
          tableColumns.set(set[0].enComponentType.toLowerCase(), new Map(columnBuffer.map((value) => [value, this.alias.get(value) as string]))
            .set('manufacturerName', this.alias.get('manufacturerName') as string))
        }
      }
      this.alias = new Map<string, string>(Object.entries((res as any[])[1]))
      this.displayedColumns = Array.from(tableColumns.get(`${this.enComponentType}`)!.keys())

    });
  }

  onColumnSelected(column: string): void {
    this.currentPropName = column
    this.currentTableValue = undefined
  }

  buildChart(): void {
    this.currentTableValue = undefined
    console.log(this.enComponentType)
    const ruComponentType = this.getRuComponentTypeByEn(this.enComponentType)
    if (ruComponentType) {
      let url: string = `chart/components/column${this.type === "line" ? "-line" : ""}/${this.type}?ruComponentType=${ruComponentType}&param=${this.currentPropName}&all=1`
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

  getChartalias(name: string): string {
    return chartNamesMap.get(name) as string
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
}

