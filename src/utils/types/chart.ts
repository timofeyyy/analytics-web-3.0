import { SafeResourceUrl } from "@angular/platform-browser";

import {
    ChartComponent,
    ApexAxisChartSeries,
    ApexChart,
    ApexXAxis,
    ApexDataLabels,
    ApexStroke,
    ApexYAxis,
    ApexFill,
    ApexLegend,
    ApexPlotOptions
} from "ng-apexcharts";

export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    dataLabels: ApexDataLabels;
    plotOptions: ApexPlotOptions;
    stroke: ApexStroke;
    xaxis: ApexXAxis;
    yaxis: ApexYAxis | ApexYAxis[];
    colors: string[];
    fill: ApexFill;
    legend: ApexLegend;
    responsive: ApexResponsive[];
    labels: any;
    theme: ApexTheme;
    title: ApexTitleSubtitle;
};


export interface ILinks {
    url: string,
    safeUrl: SafeResourceUrl
}

export interface IOptions {
    optionsList: Map<string, []>,
    currentValues: Map<string, string | number>
}

// export interface IApiConfig {
//     apexChartData: IApexChartData,
//     sortColumns: Map<string, []>
// }

// export interface IApexChartData {
//     categories: Array<string | number>,
//     series: Array<Partial<ISeries>>,
//     yLabel: string,
//     xLabel: string,
//     chart: Partial<{
//         type: string,
//         stacked: boolean
//     }>,
//     yaxis:
//     {
//         opposite: boolean,
//         title: {
//             text: string
//         }
//     }[],
//     horizontal: boolean
// }

export interface ISeries {
    name: string | number,
    type: string | undefined
    data: Array<string | number>
}

export interface ISeriesData {
    name: []
}