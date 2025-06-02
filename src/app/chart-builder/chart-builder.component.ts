import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NavigatorComponent } from '../components/navigator/navigator.component';
import { PropNameSelectionComponent } from '../components/selection/prop_name_selection/prop_name_selection.component';
import { ThisReceiver } from '@angular/compiler';
import { NgStyle } from '@angular/common';
import { PropSelectionComponent } from '../components/selection/prop_selection/prop_selection.component';
import { ComponentOptions, FilterDropBox } from '../../utils/types/app';
import { ApiService1 } from '../../services/api.services1';
import { forkJoin } from 'rxjs';
import { AppEnum, ComponentTypeRuEnum } from '../../utils/enum/app.enum';
import { ImageName } from '../../utils/types/config';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import componentTypeFilters from '../../utils/fnc1/filters/componentType';
import componentKindFilters from '../../utils/fnc1/filters/componentKind';
import manufacturerNameFilters from '../../utils/fnc1/filters/manufacturerName';

@Component({
  selector: 'app-chart-builder',
  imports: [PropNameSelectionComponent, NgStyle, PropSelectionComponent, NavigatorComponent, HttpClientModule],
  templateUrl: './chart-builder.component.html',
  styleUrls: ['./chart-builder.component.css', '../components/styles/button.css'],
  providers: [ApiService1]
})
export class ChartBuilderComponent implements OnInit {
  @ViewChild('template') chartTemplate: any;
  @ViewChild('navigator') navigator: any;
  holderState!: boolean
  clientHeight!: number
  storage!: Map<any, any[]>
  currentPropName!: string
  ruComponentType!: string
  props: any
  prop!: string | null
  loader!: boolean
  allias: Map<string, string> = new Map<string, string>()
  all!: Partial<ComponentOptions>[]
  chart!: string | null
  url: any
  constructor(private api: ApiService1, private santizer: DomSanitizer) { }
  ngOnInit(): void {
    this.all = []
    this.holderState = false
    this.clientHeight = 0
    this.loader = true
    this.storage = new Map<any, any[]>
    this.props = {}
    this.chart = "bar"
    this.ruComponentType = AppEnum.ALL
    // this.url = "chart1/parent/components/componentTypes/bar?child_req_name=components&child_chart_name=componentKinds"
    // this.props['manufacturerName'] = {
    //   currentvalue: AppEnum.ALL,
    //   sort: (props: any, all: ComponentOptions[]) => manufacturerNameFilters(props, all)
    // }
    // this.props['ruComponentKind'] = {
    //   currentvalue: AppEnum.ALL,
    //   sort: (props: any, all: ComponentOptions[]) => componentKindFilters(props, all)
    // }
    this.props['ruComponentType'] = {
      currentvalue: AppEnum.ALL,
      sort: (props: any, all: ComponentOptions[]) => componentTypeFilters(props, all),
      componentProps: (new Map())
        .set(
          ComponentTypeRuEnum.MICROCHIP,
          {
            'bitDepthValue': {
              currentvalue: AppEnum.ALL
            },
            'ruTechnologyName': {
              currentvalue: AppEnum.ALL
            }
          }
        )
        .set(
          ComponentTypeRuEnum.CAPACITOR,
          {
            'outputType': {
              currentvalue: AppEnum.ALL
            }
          }
        ),
    }
    this.api.getAlias()?.pipe().subscribe(
      (data) => {
        this.allias = new Map<string, string>(Object.entries(data))
        // console.log(this.allias)
      }
    )
    this.getApi()
    this.buildChart()
  }
  onPropChange(value: string): void {
    this.currentPropName = "props"
    this.prop = value
    this.buildChart()
  }
  buildChart(): void {
    let url = `chart1/parent/components/componentTypes/${this.chart}?`
    if (this.ruComponentType != AppEnum.ALL) {
      url += `ruComponentType=${this.ruComponentType}`
    }
    // if (this.prop && this.chart) {
    //   let url: string = `chart1/parent/components/componentTypes/${this.chart}?ruComponentType=${this.ruComponentType}`
    //   if (this.prop != AppEnum.NONE) {
    //     url += `&&child_req_name=${this.prop}&&child_chart_name=${this.prop}`
    //   }
    this.url = this.santizer.bypassSecurityTrustResourceUrl(url)
    // }
  }
  getApi(): void {
    forkJoin([
      this.api.getDiods(),
      this.api.getTransistors(),
      this.api.getCapacitors(),
      this.api.getMicrochips(),
      this.api.getAlias()
    ]).subscribe(res => {
      this.storage.set(ComponentTypeRuEnum.DIOD, (res as any[])[0])
      this.storage.set(ComponentTypeRuEnum.TRANSISTOR, (res as any[])[1])
      this.storage.set(ComponentTypeRuEnum.CAPACITOR, (res as any[])[2])
      this.storage.set(ComponentTypeRuEnum.MICROCHIP, (res as any[])[3])
      // const allias = (res as any[])[4]
      if (this.storage.size === 4) {
        this.storage.forEach((set: any) => {
          (set as []).forEach((item: any) => {
            this.all.push({
              component: item,
            })
          })
        })
      }
      this.loader = false
    });
  }

  updateRuComponentType(options: { option: Partial<FilterDropBox>, currentProp: string | undefined }): void {
    // let componentProps: Map<string, { [key: string]: FilterDropBox }> = this.props['ruComponentType'].componentProps
    this.currentPropName = options.currentProp as string
    this.ruComponentType = options.option.currentValue as string
    this.props[options.option.propName as string].currentvalue = options.option.currentValue
    if (!options.currentProp) {
      this.buildChart()
    }
  }
}
