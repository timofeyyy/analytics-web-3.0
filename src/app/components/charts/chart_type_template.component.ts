import { HttpClientModule } from '@angular/common/http';
import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ChartType, NgApexchartsModule } from 'ng-apexcharts';
import { catchError, combineLatest, map, Observable } from 'rxjs';
import { chartOptionsData, defaultChartOptions, observableApiMap } from '../../../assets/fetch.config';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ChartOptions } from '../../../utils/types/chart';
import { ApiService1 } from '../../../services/api.services1';
import { NgIf, NgStyle, Location } from '@angular/common';

@Component({
  selector: 'app-chart',
  imports: [NgApexchartsModule, HttpClientModule, NgIf],
  providers: [ApiService1],
  templateUrl: './chart_type_template.component.html',
  styleUrls: ['./chart_type_template.component.css', '../styles/button.css']
})
export class ChartTemplateComponent implements OnInit {
  chartOptions!: Partial<ChartOptions>
  chartName!: string
  loader!: boolean
  disabled!: boolean
  constructor(
    private api: ApiService1,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.disabled = false
    this.loader = true
    this.chartOptions = defaultChartOptions
    const query = new Map(Object.entries((this.route.snapshot.queryParamMap as any).params));
    this.route.paramMap.subscribe(params => {
      const req_name = params.get('req_name');
      const chart_name = params.get('chart_name');
      let type_name = params.get('type_name') || 'bar';
      if (req_name && chart_name) {
        this.getChartData(query, req_name, chart_name, type_name);
      }
    })
    // query.forEach((value, key) => {
      // console.log(value, key);
    // })
  }


  getChartData(query: Map<string, any>, req_name: string, chart_name: string, type_name: string): Partial<ChartOptions> | null {
    let getObservable: ((injector: ApiService1, data: Map<string, any>) => Observable<any> | null) | undefined = observableApiMap.get(req_name);
    let res: Partial<ChartOptions> | null = null;
    console.log('req')
    if (getObservable) {
      getObservable(this.api, query)?.pipe(
        map((api: any) => {
          let data = chartOptionsData[chart_name].chartData[type_name](api, query, this.router) as ChartOptions;
          this.chartName = chartOptionsData[chart_name].chartName(query);
          this.chartOptions = {
            ...data,
            legend: {
              onItemClick: {
                toggleDataSeries: false
              },
              onItemHover: {
                highlightDataSeries: false
              }
            },

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
          this.loader = false
        }),
        catchError((err: any) => {
          this.loader = false
          this.router.navigateByUrl('/not-found')
          console.log(err.message)
          return [];
        })
      )
        .subscribe()
    }
    return res;
  }

  getBack(): void {
    this.disabled = true
    window.history.back()
  }
}