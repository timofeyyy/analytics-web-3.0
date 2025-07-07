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
import { ChartActions } from "../enum/app.enum";

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
    values: string[];
    propName: string,
    chartName: string,
    column: {
        action: ChartActions
    },
    back: boolean,
    mapWithMaxValues: Map<string, number>
};
