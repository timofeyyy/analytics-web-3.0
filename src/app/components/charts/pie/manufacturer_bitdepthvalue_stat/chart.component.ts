import { HttpClientModule } from '@angular/common/http';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ChartType, NgApexchartsModule } from 'ng-apexcharts';
import { ApiService } from '../../../../../services/api.services';
import { catchError, map } from 'rxjs';
import { apiConfig, chartOptions } from '../../../../../assets/fetch.config';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ChartOptions } from '../../../../../utils/types/chart';
import getManufacturerBitDepthValueStat from '../../../../../utils/fnc/pie/bitdepthvalue';
import { ChartData } from '../../../../../utils/types/app';

@Component({
  selector: 'app-chart',
  imports: [NgApexchartsModule, HttpClientModule],
  providers: [ApiService],
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css',  '../../../styles/button.css']
})
export class ManufacturerBitDepthValueComponent implements OnInit {
  chartOptions!: Partial<ChartOptions>
  manufacturerName!: string | null
  chartType!: string | null

  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) { }


  ngOnInit(): void {
    this.manufacturerName = this.route.snapshot.queryParamMap.get('manufacturerName')
    this.route.paramMap.subscribe(params => {
      this.chartType = params.get('chart')
    })
    this.chartOptions = {
      ...chartOptions,
      series: []
    };
    this.getApi()
  }

  getApi(): void {
    this.api.getBitDepthValue(this.manufacturerName as string)?.pipe(
      map((api: any) => {
        console.log(api)
        let data: ChartData = apiConfig["bitdepthvalue"][this.chartType as string](api) as ChartData;
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


    // this.chartOptions = {
    //   series: value.series,
    //   chart: value.chart,
    //   labels: value.labels,
    //   legend: {
    //     fontSize: `10vw`
    //   }
    // }


    this.chartOptions = {
      ...value.chartOptions,
      colors: chartOptions.colors,
      chart: {
        ...value.chartOptions?.chart,
        type: value.chartOptions?.chart?.type as ChartType,
        events: {
          dataPointSelection: (event, chartContext, opts) => {
            // this.router.navigateByUrl(`chart/${this.componentType}/manufacturers/${this.chartType}/bitdepthvalue?manufacturerName=${this.chartType === "bar" ? value.xaxis?.categories[opts.dataPointIndex] as string : value.labels[opts.dataPointIndex] as string}`)
          }
        }
      }
    }
  }

  getBack(): void {
    this.router.navigate(['../'], {relativeTo: this.route})
  }
}


 