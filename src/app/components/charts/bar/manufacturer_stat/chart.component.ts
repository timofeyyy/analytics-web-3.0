import { HttpClientModule } from '@angular/common/http';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ChartType, NgApexchartsModule } from 'ng-apexcharts';
import { ApiService } from '../../../../../services/api.services';
import { catchError, map } from 'rxjs';
import { chartOptions } from '../../../../../assets/fetch.config';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ChartOptions } from '../../../../../utils/types/chart';
import getComponentKindStat from '../../../../../utils/fnc/other/componentkinds_stat_chartoptions.fnc';
import getManufacturersChartOption from '../../../../../utils/fnc/bar/manufacturers';
import getManufacturersChartOptionBar from '../../../../../utils/fnc/bar/manufacturers';
import { ChartData } from '../../../../../utils/types/app';

@Component({ 
  selector: 'app-chart',
  imports: [NgApexchartsModule, HttpClientModule],
  providers: [ApiService],
  templateUrl: './chart.component.html',
  styleUrl: '../bar.component.css'
})
export class ChartComponent implements OnInit {
  chartOptions!: Partial<ChartOptions>
  // manufacturerName!: string | null
  componentType!: string | null

  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) { }


  ngOnInit(): void {
    // this.router.events.subscribe(event => {
    //   if (event instanceof NavigationEnd) {

    //     this.getApi()

    //   }
    // });

    // this.manufacturerName = this.route.snapshot.queryParamMap.get('manufacturerName')
    this.componentType = this.route.snapshot.queryParamMap.get('componenttype')

    // console.log(this.componentType)

    this.chartOptions = {
      ...chartOptions,
      series: []
    };
    this.getApi()
  }

  getApi(): void {
    this.api.getOptionsApi(this.componentType as string)?.pipe(
      map((api: any) => {
        let data: ChartData = getManufacturersChartOptionBar(api) as ChartData;
        this.buildChart(data)

      }),
      catchError((err: any) => {
        console.log(err.message)
        return [];
      })
    )
      .subscribe()
  }

  buildChart(value: Partial<ChartData>): void {
    this.chartOptions = {
      ...chartOptions,
      series: value.chartOptions?.series,
      xaxis: {
        categories: value.chartOptions?.xaxis?.categories,
        title: {
          text: value.chartOptions?.xaxis?.title?.text
        },
        type: 'category',
        labels: {
          style: {
            fontSize: '0px',

          },
        },
        tickPlacement: 'on'
      },
      chart: {
        ...value.chartOptions?.chart,
        type: value.chartOptions?.chart?.type as ChartType,
        events: {
          dataPointSelection: (event, chartContext, opts) => {
            this.router.navigateByUrl(`chart/manufacturers/production?manufacturerName=${value.chartOptions?.xaxis?.categories[opts.dataPointIndex] as string}`)
          }
        }
      },
      yaxis: value.chartOptions?.yaxis,
      plotOptions: {
        bar: {
          horizontal: value.chartOptions?.plotOptions?.bar?.horizontal
        }
      }
    }
  }
}
