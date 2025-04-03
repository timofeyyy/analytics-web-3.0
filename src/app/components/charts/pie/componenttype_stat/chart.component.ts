import { HttpClientModule } from '@angular/common/http';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ChartType, NgApexchartsModule } from 'ng-apexcharts';
import { ApiService } from '../../../../../services/api.services';
import { catchError, map } from 'rxjs';
import { chartOptions } from '../../../../../assets/fetch.config';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ChartOptions } from '../../../../../utils/types/chart';
import getManufacturerBitDepthValueStat from '../../../../../utils/fnc/pie/bitdepthvalue';
import getComponentTypesStatChartOptions from '../../../../../utils/fnc/other/componentytpes_stat_chartoptions';

@Component({
  selector: 'app-chart',
  imports: [NgApexchartsModule, HttpClientModule],
  providers: [ApiService],
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css',  '../../../styles/button.css']
})
export class ComponentTypeStatComponent implements OnInit {
  chartOptions!: Partial<ChartOptions>
  manufacturerName!: string | null

  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) { }


  ngOnInit(): void {
    this.manufacturerName = this.route.snapshot.queryParamMap.get('manufacturerName')
    this.chartOptions = {
      ...chartOptions,
      series: []
    };
    this.getApi()
  }

  getApi(): void {
    this.api.getOptionsApi()?.pipe(
      map((api: any) => {

        let data: ChartOptions = getComponentTypesStatChartOptions(api) as ChartOptions;
        console.log(data)
        
        this.buildChart(data)

      }),
      catchError((err: any) => {
        console.log(err.message)
        return [];
      })
    )
      .subscribe()
  }

  buildChart(value: Partial<ChartOptions>): void {


    this.chartOptions = {
      series: value.series,
      chart: {
        ...value.chart,
        type: value.chart?.type as ChartType,
        events: {
          dataPointSelection: (event, chartContext, opts) => {

          }
        }
      },
      labels: value.labels
    }
  }
}


 