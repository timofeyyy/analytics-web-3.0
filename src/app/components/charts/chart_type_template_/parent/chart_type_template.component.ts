import { HttpClientModule } from '@angular/common/http';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ChartType, NgApexchartsModule } from 'ng-apexcharts';
import { catchError, map, Observable } from 'rxjs';
import { chartOptionsData, defaultOptions, observableApiMap } from '../../../../../assets/fetch.config';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ChartOptions } from '../../../../../utils/types/chart';
import { ApiService1 } from '../../../../../services/api.services1';

@Component({
  selector: 'app-chart',
  imports: [NgApexchartsModule, HttpClientModule],
  providers: [ApiService1],
  templateUrl: './chart_type_template.component.html',
  styleUrls: ['./chart_type_template.component.css', '../../../styles/button.css']
})
export class ParentChartTemplateComponent implements OnInit {
  chartOptions!: Partial<ChartOptions>
  chartName!: string
  // http://localhost:4200/chart1/components/components/bar
  constructor(
    private api: ApiService1,
    private router: Router,
    private route: ActivatedRoute
  ) { }


  ngOnInit(): void {
    this.chartOptions = defaultOptions
    const query = new Map(Object.entries((this.route.snapshot.queryParamMap as any).params));
    let req_name;
    let chart_name;
    let type_name;
    this.route.paramMap.subscribe(params => {
      req_name = params.get('req_name')
      chart_name = params.get('chart_name')
      type_name = params.get('type_name')
      if(!type_name){
        type_name = "bar"
      }
      if(req_name && chart_name ) {
        this.getChartData(query, req_name, chart_name, type_name);
      }
    })
    query.forEach((value, key) => {
      console.log(value, key);
    })
  }


  getChartData(query: Map<string, any>, req_name: string, chart_name: string, type_name: string): Partial<ChartOptions> | null {
    let getObservable: ((injector: ApiService1, data: Map<string, any>) => Observable<any> | null) | undefined = observableApiMap.get(req_name);
    let res : Partial<ChartOptions> | null = null;
    if(getObservable) {
      getObservable(this.api, query)?.pipe(
        map((api: any) => {
          let data = chartOptionsData[chart_name].chartData[type_name](api) as ChartOptions;
          this.chartName = chartOptionsData[chart_name].chartName(query);
          // console.log(query)

          this.chartOptions = {
            ...data,
            chart: {
              ...data.chart,
              events: {
                dataPointSelection: (event, chartContext, opts) => {
                  // console.log(data.values[opts.dataPointIndex])
                  let child_req_name = query.get('child_req_name')
                  let child_chart_name = query.get('child_chart_name')
                  let componentType = query.get('ruComponentType')
                  
                  if(child_chart_name && child_req_name) {
                    let url = `chart1/child/${child_req_name}/${child_chart_name}/${type_name}?manufacturerName=${data.values[opts.dataPointIndex]}&&`
                    if(componentType) {
                      url+=`ruComponentType=${componentType}`
                    }
                    this.router.navigateByUrl(url)
                  }
                }
              }
            }
          }
          // console.log(this.chartOptions)
        }),
        catchError((err: any) => {
          console.log(err.message)
          return [];
        })
      )
        .subscribe()
    }
    return res;
  }

  // getApi(): void {
  //   this.api.getComponentsApi(this.componentType as string)?.pipe(
  //     map((api: any) => {

  //       let data: ChartOptions =  apiConfig["manufacturers"][this.chartType as string](api) as ChartOptions;

  //       console.log(data)

  //       this.buildChart(data)

  //     }),
  //     catchError((err: any) => {
  //       console.log(err.message)
  //       return [];
  //     })
  //   )
  //     .subscribe()
  // }

  // buildChart(value: Partial<ChartOptions>): void {


  //   this.chartOptions = {
  //     ...value,
  //     colors: chartOptions.colors,
  //     chart: {
  //       ...value.chart,
  //       type: value?.chart?.type as ChartType,
  //       events: {
  //         dataPointSelection: (event, chartContext, opts) => {
  //           // console.log(value.values)
  //           this.router.navigateByUrl(`chart/${this.componentType}/manufacturers/${this.chartType}/bitdepthvalue?manufacturerName=${(value.values as [])[opts.dataPointIndex]}`)
  //         }
  //       }
  //     }
  //   }

  // }
}


