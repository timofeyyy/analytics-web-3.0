import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, Input, input, OnChanges, OnDestroy, OnInit, Query, SimpleChanges } from '@angular/core';
import { ChartType, NgApexchartsModule } from 'ng-apexcharts';
import { catchError, combineLatest, forkJoin, map, Observable } from 'rxjs';
import { chartOptionsData, observableApiMap } from '../../fetch.config';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ChartOptions } from '../../../utils/types/chart';
import { ApiService1 } from '../../../services/api.services1';
import { NgIf, NgStyle, Location, NgClass } from '@angular/common';

@Component({
  selector: 'app-chart',
  imports: [NgApexchartsModule, HttpClientModule, NgIf, NgStyle],
  providers: [ApiService1],
  templateUrl: './chart_template.component.html',
  styleUrls: ['./chart_template.component.css', '../styles/button.css']
})
export class ChartTemplateComponent implements OnInit, OnChanges {
  @Input()
  noHeader!: boolean
  @Input()
  all!: any
  @Input()
  chart_name!: string
  @Input()
  req_name!: string
  @Input()
  type_name!: string
  @Input()
  headerFontSize!: string
  @Input()
  chartOptions: Partial<ChartOptions> | undefined
  @Input()
  query!: Map<string, string>
  chartName!: string
  disabled!: boolean

  constructor(
    private api: ApiService1,
    private route: ActivatedRoute,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.all) {
      this.chartOptions = undefined
      this.getChartData(this.all, this.query, this.chart_name, this.type_name)
    }
  }

  ngOnInit(): void {
    this.disabled = false
    if (!this.all) {
      this.query = new Map(Object.entries((this.route.snapshot.queryParamMap as any).params));
      this.route.paramMap.subscribe(params => {
        const req_name = params.get('req_name');
        const chart_name = params.get('chart_name');
        let type_name = params.get('type_name') || 'bar';
        if (req_name && chart_name) {
          this.getDataReady(this.query, req_name, chart_name, type_name);
        }
      })
    }
    else {
      this.getChartData(this.all, this.query, this.chart_name, this.type_name)
    }
  }
  @Input()
  allias: Map<string, string> = new Map()
  getDataReady(query: Map<string, any>, req_name: string, chart_name: string, type_name: string): Partial<ChartOptions> | null {
    let getObservable: ((injector: ApiService1, data: Map<string, any>) => Observable<any> | null) | undefined = observableApiMap.get(req_name);
    let res: Partial<ChartOptions> | null = null;
    if (getObservable) {
      forkJoin([
        this.api.getAlias(),
        getObservable(this.api, query)
      ]).subscribe(res => {
        this.allias = new Map<string, string>(Object.entries((res as any[])[0]))
        this.getChartData((res as any[])[1], query, chart_name, type_name)
      })
    }
    return res;
  }

  getChartData(api: any, query: Map<string, any>, chart_name: string, type_name: string): void {
    if (query.get('param')) {
      query.set('allias', this.allias.get(query.get('param')))
    }
    else if (query.get('ruComponentType')) {
      query.set('allias', this.allias.get('ruComponentType'))
    }
    let data = chartOptionsData[chart_name].chartData[type_name](api, query) as ChartOptions;
    this.chartName = chartOptionsData[chart_name].chartName(query);
    this.chartOptions = {

      ...data,
      // dataLabels: {
      //   enabled: false,
      //   // style: {
      //   //   fontSize: '0.5vw', // Set font size using vw units
      //   //   fontFamily: 'Helvetica, Arial, sans-serif',
      //   //   fontWeight: 'bold',
      //   //   colors: ['#000'] // Optional: set label color
      //   // }
      // },
      // legend: {
      //   onItemClick: {
      //     toggleDataSeries: false
      //   },
      //   onItemHover: {
      //     highlightDataSeries: false
      //   },
      //   // fontSize: `${window.innerWidth * 0.01}px`
      // },
      chart: {
        ...data.chart,
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        },
        selection: {
          enabled: false
        },
      }
    }
  }

  getBack(): void {
    this.disabled = true
    window.history.back()
  }
  // @HostListener('window:resize', ['$event'])

  // onResize(event: any) {
  // if (this.chartOptions && this.chartOptions.legend && this.chartOptions.legend.fontSize) {
  //   this.chartOptions = {
  //     ...this.chartOptions,
  //     legend: {
  //       ...this.chartOptions.legend,
  //       fontSize: `${window.innerWidth * 0.0075}px`
  //     }
  //   }
  // }
  // }
}