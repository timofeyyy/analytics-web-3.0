import { HttpClientModule } from '@angular/common/http';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ChartType, NgApexchartsModule } from 'ng-apexcharts';
import { ApiService } from '../../../../../services/api.services';
import { catchError, map } from 'rxjs';
import { apiConfig, chartOptions } from '../../../../../assets/fetch.config';
import getManufacturersStatChartOption from '../../../../../utils/fnc/bar/manufacturers';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ChartOptions } from '../../../../../utils/types/chart';
import getComponentKindStatChartOptions from '../../../../../utils/fnc/other/componentkinds_stat_chartoptions.fnc';

@Component({
  selector: 'app-chart',
  imports: [NgApexchartsModule, HttpClientModule],
  providers: [ApiService],
  templateUrl: './chart.component.html',
  styleUrls: ['../bar.component.css',  '../../../styles/button.css']
})
export class KindStatComponent implements OnInit {
  chartOptions!: Partial<ChartOptions>
  manufacturerName!: string | null
  // componentType!: string | null

  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) { }


  ngOnInit(): void {
    this.manufacturerName = this.route.snapshot.queryParamMap.get('manufacturerName')
    // this.componentType = this.route.snapshot.queryParamMap.get('componenttype')

    // console.log(this.componentType)

    this.chartOptions = {
      ...chartOptions,
      series: []
    };
    this.getApi()
  }

  getApi(): void {
    this.api.getOptionsApi(void(""), this.manufacturerName as string)?.pipe(
      map((api: any) => {
        let data: ChartOptions = getComponentKindStatChartOptions(api) as ChartOptions;
        this.buildChart(data)
      }),
      catchError((err: any) => {
        console.log(err.message)
        // this.router.navigate([`/not-found`])
        // this.loader = false
        return [];
      })
    )
      .subscribe()
  }
  buildChart(value: Partial<ChartOptions>): void {
    this.chartOptions = {
      ...chartOptions,
      series: value.series,
      xaxis: {
        categories: value.xaxis?.categories,
        title: {
          text: value.xaxis?.title?.text
        },
        type: 'category',
        labels: {
          style: {
            fontSize: '0px',

          },
        },
        tickPlacement: 'on'
      },
      chart: value.chart,
      yaxis: value.yaxis,
      plotOptions: {
        bar: {
          horizontal: value.plotOptions?.bar?.horizontal
        }
      }
    }
  }

  getBack(): void {
    this.router.navigate(['../'], {relativeTo: this.route})
  }
}
