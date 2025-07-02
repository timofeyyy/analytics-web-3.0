import { Component, OnInit } from '@angular/core';
import { NavigatorComponent } from '../components/navigator/navigator.component';
import { ActivatedRoute } from '@angular/router';
import { ChartTypesCheckboxesComponent } from '../components/chart_types_checkboxes/chart_types_checkboxes.component';
import { DomSanitizer } from '@angular/platform-browser';
import { AppEnum, ComponentTypeRuEnum } from '../../utils/enum/app.enum';
import { ComponentOptions, FilterDropBox } from '../../utils/types/app';
import componentTypeFilters from '../../utils/fnc1/filters/componentType';
import { NgFor } from '@angular/common';
import { ApiService1 } from '../../services/api.services1';
import { forkJoin } from 'rxjs';
import { chartOptionsData, props } from '../../assets/fetch.config';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-component-template',
  imports: [NavigatorComponent, ChartTypesCheckboxesComponent, NgFor, HttpClientModule],
  providers: [ApiService1],
  templateUrl: './component_type_template.component.html',
  styleUrl: './component_type_template.component.css'
})
export class TypeTemplateComponent implements OnInit {

  prop!: string | null
  chart!: string | null
  url: any
  props: any
  currentPropName!: string
  ruComponentType!: string
  storage!: Map<string, any>
  allias!: Map<string, string>
  tableColumns!: Map<string, Map<string, string>>
  displayedColumns!: string[]
  dropBoxPropsMapConfig!: Map<string, any>
  chartName!: string

  constructor(
    private route: ActivatedRoute,
    private santizer: DomSanitizer,
    private api: ApiService1
  ) { }

  ngOnInit(): void {
    this.displayedColumns = []
    this.storage = new Map()
    this.tableColumns = new Map()
    this.allias = new Map()
    const dropBoxPropsClone: any = {};
    for (const [key, value] of Object.entries(props)) {
      dropBoxPropsClone[key] = { ...value };
    }
    this.dropBoxPropsMapConfig = new Map(Object.entries(dropBoxPropsClone));
    this.route.paramMap.subscribe(params => {
      this.ruComponentType = params.get('ruComponentType') as string
    })
    this.currentPropName = 'ruComponentType'
    this.getApi()
    this.buildChart()
  }

  getApi(): void {
    forkJoin([
      this.api.getDiods(),
      this.api.getTransistors(),
      this.api.getCapacitors(),
      this.api.getMicrochips(),
      this.api.getResistors(),
      this.api.getAlias()
    ]).subscribe(res => {
      this.storage.set(ComponentTypeRuEnum.DIOD, (res as any[])[0])
      this.storage.set(ComponentTypeRuEnum.TRANSISTOR, (res as any[])[1])
      this.storage.set(ComponentTypeRuEnum.CAPACITOR, (res as any[])[2])
      this.storage.set(ComponentTypeRuEnum.MICROCHIP, (res as any[])[3])
      this.storage.set(ComponentTypeRuEnum.RESISTOR, (res as any[])[4])
      const allias = (res as any[])[5]
      this.allias = new Map<string, string>(Object.entries(allias))
      if (this.storage.size === 5) {
        this.storage.forEach((set: any) => {
          (set as []).forEach((item: any) => {
            if (!this.tableColumns.get(item.ruComponentType)) {
              const tmp = new Map()
              for (const key in item) {
                const componentProps = this.dropBoxPropsMapConfig.get(key)
                const alliasName = this.allias.get(`${key}`)
                // console.log(chartOptionsData[key], key)
                if (alliasName && componentProps && chartOptionsData[key]) {
                  tmp.set(key, alliasName)
                }
              }
              this.tableColumns.set(item.ruComponentType, tmp)
            }
          })
        })
        // console.log(this.tableColumns)
        this.displayedColumns = Array.from(this.tableColumns.get(`${this.ruComponentType}`)!.keys())
      }
    });
  }

  onColumnSelected(column: string): void {
    this.currentPropName = column
    this.buildChart()
  }


  onChartTypeChnage(value: string): void {
    this.chart = value
    this.buildChart()
  }

  buildChart(): void {
    this.route.paramMap.subscribe(params => {
      this.ruComponentType = params.get('ruComponentType') as string
      // let prop = this.props["propNames"].currentvalue
      // if (prop && this.chart) {
      let url: string = `chart/${this.currentPropName === 'ruComponentType' ? 'components' : this.currentPropName}/${this.currentPropName}/${this.chart}?ruComponentType=${this.ruComponentType}`
      // if (prop != AppEnum.NONE) {
      //   url += `&&child_req_name=${this.props["propNames"].currentvalue}&&child_chart_name=${this.props["propNames"].currentvalue}`
      // }
      // console.log(url)
      // if(this.chart)
      //   this.url = url
      // console.log(chartOptionsData)
      // if (chartOptionsData[this.currentPropName])
      //   this.chartName = chartOptionsData[this.currentPropName].chartName(params)
      this.url = this.santizer.bypassSecurityTrustResourceUrl(url)
      // }
    })
  }
}
