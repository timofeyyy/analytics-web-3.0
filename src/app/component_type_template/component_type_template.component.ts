import { Component, OnInit } from '@angular/core';
import { NavigatorComponent } from '../components/navigator/navigator.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { AppEnum, ComponentTypeRuEnum } from '../../utils/enum/app.enum';
import { ComponentOptions, FilterDropBox } from '../../utils/types/app';
import componentTypeFilters from '../../utils/fnc1/filters/componentType';
import { NgClass, NgFor } from '@angular/common';
import { ApiService1 } from '../../services/api.services1';
import { forkJoin } from 'rxjs';
import { chartNamesMap, chartOptionsData, props } from '../../assets/fetch.config';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-component-template',
  imports: [NavigatorComponent, NgFor, HttpClientModule, NgClass],
  providers: [ApiService1],
  templateUrl: './component_type_template.component.html',
  styleUrls: ['./component_type_template.component.css', '../components/styles/button.css', '../components/styles/tabs.css']
})
export class TypeTemplateComponent implements OnInit {

  prop!: string | null
  type!: string | null
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
  chartNames!: string[]
  mainChartUrl!: any
  statMax!: any
  statMin!: any
  query!: Map<string, string>
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private santizer: DomSanitizer,
    private api: ApiService1
  ) { }

  ngOnInit(): void {
    this.query = new Map(Object.entries((this.route.snapshot.queryParamMap as any).params))
    this.chartNames = Array.from(chartNamesMap.keys())
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
      let chartName = this.query.get('chartName')
      if (this.ruComponentType) {
        this.getApi()        
        if (!chartName) {
          chartName = 'ruComponentType'
        }
        this.onColumnSelected(chartName)
        this.type = "bar"
        this.buildChart()
      }
    })

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
                if (alliasName && componentProps && chartOptionsData[key]) {
                  tmp.set(key, alliasName)
                }
              }
              this.tableColumns.set(item.ruComponentType, tmp)
            }
          })
        })
        this.displayedColumns = Array.from(this.tableColumns.get(`${this.ruComponentType}`)!.keys())
      }
    });
  }

  onColumnSelected(column: string): void {
    this.currentPropName = column
    // console.log(this.currentPropName) 
    // this.query.set('chartName', column)
    // this.router.navigate([], {
    //   relativeTo: this.route,
    //   queryParams: Object.fromEntries(this.query),
    //   queryParamsHandling: 'merge',
    //   skipLocationChange: false
    // })
  }


  buildChart(): void {
    let url: string = `chart/components/column/${this.type}?ruComponentType=${this.ruComponentType}${this.currentPropName == 'ruComponentType' ? '' : `&param=${this.currentPropName}`}`
    this.url = this.santizer.bypassSecurityTrustResourceUrl(url)
  }

  openTable(): void {
    this.router.navigateByUrl(`/catalog?ruComponentType=${this.ruComponentType}`)
  }

  getChartAllias(name: string): string {
    return chartNamesMap.get(name) as string
  }

  getKeysMax(): string[] {
    let res: string[] = []
    if (this.statMax) {
      for (const key in this.statMax) {
        res.push(`${key}:\t${this.statMax[key]}`)
      }
    }
    return res
  }
  getKeysMin(): string[] {
    let res: string[] = []
    if (this.statMin) {
      for (const key in this.statMin) {
        res.push(`${key}:\t${this.statMin[key]}`)
      }
    }
    return res
  }

  getValues(): string[] {
    let res: string[] = []
    if (this.statMax) {
      for (const key in this.statMax) {
        res.push(this.statMax[key])
      }
    }
    return res
  }
  // makeQueryStr(url: string): string {
  //   const queryObj = (this.route.snapshot.queryParamMap as any).params
  //   url += "?"
  //   for (const key in queryObj) {
  //     url += `${key}=${queryObj[key]}&`
  //   }
  //   url = url.replace('+', '%2B0')
  //   return url
  // }

}
