import { HttpClientModule } from '@angular/common/http';
import { Component, HostListener, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ChartType, NgApexchartsModule } from 'ng-apexcharts';
import { catchError, combineLatest, map, Observable } from 'rxjs';
import { chartOptionsData, observableApiMap } from '../../../assets/fetch.config';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ChartOptions } from '../../../utils/types/chart';
import { ApiService1 } from '../../../services/api.services1';
import { NgIf, NgStyle, Location } from '@angular/common';

@Component({
  selector: 'app-chart',
  imports: [NgApexchartsModule, HttpClientModule, NgIf],
  providers: [ApiService1],
  templateUrl: './chart_template.component.html',
  styleUrls: ['./chart_template.component.css', '../styles/button.css']
})
export class ChartTemplateComponent implements OnInit {
  chartOptions!: Partial<ChartOptions>
  chartName!: string
  loader!: boolean
  disabled!: boolean
  defaultChartOptions: Partial<ChartOptions> = {
    series: [],
    chart: {
      type: "bar",
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "80%"
      }
    },

    colors: ['#d4526e', '#13d8aa', '#A5978B', '#2b908f', '#f9a3a4',
      '#90ee7e', '#f48024', '#69d2e7', 'brown', 'blue', 'black', 'gold'
    ],

    yaxis: {

    },
    xaxis: {
      categories: [

      ],
      title: {
        text: "example"
      }
    },
    dataLabels: {
      enabled: false
    },
  }

  constructor(
    private api: ApiService1,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.disabled = false
    this.loader = true
    this.chartOptions = this.defaultChartOptions
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
    if (getObservable) {
      getObservable(this.api, query)?.pipe(
        map((api: any) => {
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

          if (!window.localStorage.getItem('chartOptions')) {
            window.localStorage.setItem('chartOptions', JSON.stringify({}))
          }
          let chartOptions = JSON.parse((window.localStorage.getItem('chartOptions') as string))
          let chartOptionsName = chartOptions[chart_name] 
          if(!chartOptionsName) {
            chartOptionsName = {}
          } 
          chartOptionsName[type_name] = this.chartOptions
          chartOptions[chart_name]  = chartOptionsName
          
          window.localStorage.setItem('chartOptions', JSON.stringify(chartOptions))
          console.log(JSON.parse((window.localStorage.getItem('chartOptions') as string)))

          this.loader = false
        }),
        catchError((err: any) => {
          this.loader = false
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