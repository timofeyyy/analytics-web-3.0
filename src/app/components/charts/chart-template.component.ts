import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, Input, input, NgZone, OnChanges, OnDestroy, OnInit, Query, SimpleChanges, ViewChild } from '@angular/core';
import { ChartComponent, ChartType, NgApexchartsModule } from 'ng-apexcharts';
import { catchError, combineLatest, delay, forkJoin, map, Observable, of } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ChartOptions } from '../../../utils/types/chart';
import { ApiService } from '../../../services/api.services1';
import { NgIf, NgStyle, Location, NgClass } from '@angular/common';
import { chartOptionsData } from '../../../utils/static-data/chart-options';
import { observableApiMap } from '../../../utils/static-data/observables';

@Component({
  selector: 'app-chart',
  imports: [NgApexchartsModule, HttpClientModule, NgIf],
  providers: [ApiService],
  templateUrl: './chart-template.component.html',
  styleUrls: ['./chart-template.component.css', '../styles/button.css']
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
  chartOptions: Partial<ChartOptions> | undefined
  
  chartName!: string
  disabled!: boolean
  @ViewChild('apexChart') apexChart!: ChartComponent;
  @Input()
  alias: Map<string, string> = new Map()
  @Input()
  query!: Map<string, string>
  constructor(
    private api: ApiService,
    private route: ActivatedRoute
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.all) {
      this.getChartData(this.all, this.query, this.chart_name, this.type_name)
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
        toolbar: { show: false },
        zoom: { enabled: false },
        selection: { enabled: false }
      }
    };

    setTimeout(() => {
      this.chartName = chartName
      this.chartOptions = chartOptions;
    })
  }
}