import { HttpClientModule } from '@angular/common/http';
import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, EventEmitter, HostListener, Input, input, NgZone, OnChanges, OnDestroy, OnInit, Output, Query, SimpleChanges, ViewChild } from '@angular/core';
import { ChartComponent, ChartType, NgApexchartsModule } from 'ng-apexcharts';
import { catchError, combineLatest, delay, forkJoin, map, Observable, of } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ChartOptions } from '../../../utils/types/chart';
import { ApiService } from '../../../services/api.services';
import { NgIf, NgStyle, Location, NgClass } from '@angular/common';
import { chartOptionsData } from '../../../utils/static-data/chart-options';
import { observableApiMap } from '../../../utils/static-data/observables';

@Component({
  selector: 'app-chart',
  imports: [NgApexchartsModule, HttpClientModule, NgIf, NgStyle],
  providers: [ApiService],
  templateUrl: './chart-template.component.html',
  styleUrls: ['./chart-template.component.css', '../styles/button.css']
})
export class ChartTemplateComponent implements OnInit, OnChanges, AfterViewInit {
  @Input()
  innerWidthPrecent!: number | 'unset'
  @Input()
  noHeader!: boolean
  @Input()
  all!: any
  @Input()
  chartName!: string
  @Input()
  reqName!: string
  @Input()
  typeName!: string
  @Input()
  paragraphSize: string | undefined
  chartOptions: Partial<ChartOptions> | undefined

  paragraphValue!: string
  disabled!: boolean
  @ViewChild('apexChart') apexChart!: ChartComponent;
  @Input()
  alias: Map<string, string> = new Map()
  @Input()
  query!: Map<string, string>
  // @Input()
  // xLabelsSize!: string
  // @Input()
  // yLabelsSize!: string


  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) { }

  @Output()
  onLabelChange: EventEmitter<string> = new EventEmitter()

  ngOnChanges(changes: SimpleChanges): void {
    // console.log(this.all, this.query, this.chart_name, this.type_name, this.req_name, this.alias)
    if (this.all) {
      this.getChartData(this.all, this.query, this.chartName, this.typeName)
    }
  }

  ngOnInit(): void {
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
  }

  getDataReady(query: Map<string, any>, req_name: string, chart_name: string, type_name: string): Partial<ChartOptions> | null {
    let getObservable: ((injector: ApiService, data: Map<string, any>) => Observable<any> | null) | undefined = observableApiMap.get(req_name);
    let res: Partial<ChartOptions> | null = null;
    if (getObservable) {
      forkJoin([
        this.api.getAlias(),
        getObservable(this.api, query)
      ]).subscribe(res => {
        this.alias = new Map<string, string>(Object.entries((res as any[])[0]))
        this.getChartData((res as any[])[1], query, chart_name, type_name)
      })
    }
    return res;
  }

  getChartData(all: any, query: Map<string, any>, chart_name: string, type_name: string): void {
    this.chartOptions = undefined
    const newQuery = new Map(query);
    if (newQuery.get('param')) {
      newQuery.set('alias', this.alias.get(newQuery.get('param')));
    } else if (newQuery.get('ruComponentType')) {
      newQuery.set('alias', this.alias.get('ruComponentType'));
    }
    let data = chartOptionsData[chart_name].chartData[type_name](all, newQuery) as ChartOptions;
    const chartName = chartOptionsData[chart_name].chartName(all, newQuery);
    const chartOptions = {
      ...data,
      chart: {
        ...data.chart,
        // toolbar: { show: true },
        zoom: { enabled: true, autoScaleYaxis: false },
      }
    }

    setTimeout(() => {
      this.paragraphValue = chartName
      this.chartOptions = chartOptions;
      this.onLabelChange.emit()
      this.getChartBlob()
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.getChartBlob()
    }, 1000);
  }
  @Output()
  private onBlobLoaded: EventEmitter<any> = new EventEmitter()
  getChartBlob(): void {
    if (this.apexChart && this.query.get('priority')) {
      this.apexChart.dataURI().then(({ imgURI }: any) => {
        this.onBlobLoaded.emit([imgURI, this.query.get('priority')![0]])
      });
    }
  }
}