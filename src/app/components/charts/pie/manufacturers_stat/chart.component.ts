import { HttpClientModule } from '@angular/common/http';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ChartType, NgApexchartsModule } from 'ng-apexcharts';
import { ApiService } from '../../../../../services/api.services';
import { catchError, map } from 'rxjs';
import { apiConfig, chartOptions } from '../../../../../assets/fetch.config';
import getManufacturerStat from '../../../../../utils/fnc/bar/manufacturers';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ChartOptions } from '../../../../../utils/types/chart';
import getComponentKindStat from '../../../../../utils/fnc/other/componentkinds_stat_chartoptions.fnc';
import getTestPieStat from '../../../../../utils/fnc/donut/manufacturers';
import getManufacturersBitDepthValueStat from '../../../../../utils/fnc/donut/manufacturers';
import { ChartData } from '../../../../../utils/types/app';

@Component({
  selector: 'app-chart',
  imports: [NgApexchartsModule, HttpClientModule],
  providers: [ApiService],
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css', '../../../styles/button.css']
})
export class ManufacturersComponent implements OnInit {
  chartOptions!: Partial<ChartOptions>
  chartType!: string | null
  componentType!: string | null
  
  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) { }


  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.chartType = params.get('chart')
      this.componentType = params.get('componenttype')
    })
    this.chartOptions = {
      ...chartOptions,
      series: []
    };
    this.getApi()
  }

  getApi(): void {
    this.api.getOptionsApi(this.componentType as string)?.pipe(
      map((api: any) => {

        let data: ChartData =  apiConfig["manufacturers"][this.chartType as string](api) as ChartData;

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

  buildChart(value: Partial<ChartData>): void {


    this.chartOptions = {
      ...value.chartOptions,
      colors: chartOptions.colors,
      chart: {
        ...value.chartOptions?.chart,
        type: value.chartOptions?.chart?.type as ChartType,
        events: {
          dataPointSelection: (event, chartContext, opts) => {
            // console.log(value.values)
            this.router.navigateByUrl(`chart/${this.componentType}/manufacturers/${this.chartType}/bitdepthvalue?manufacturerName=${(value.values as [])[opts.dataPointIndex]}`)
          }
        }
      }
    }

  }
}


