
import getComponentKindStatChartOptions from "../utils/fnc/other/componentkinds_stat_chartoptions.fnc";
import getComponentKindStat from "../utils/fnc/other/componentkinds_stat_chartoptions.fnc";
import getManufacturersStatChartOption from "../utils/fnc/bar/manufacturers";
import getManufacturerStat from "../utils/fnc/bar/manufacturers";
import getManufacturerBitDepthValueStat from "../utils/fnc/pie/bitdepthvalue";
import getManufacturersBitDepthValueStat from "../utils/fnc/donut/manufacturers";
import { ChartData, OptionsApi } from "../utils/types/app";
import { ChartOptions } from "../utils/types/chart";
import getManufacturersChartOptionBar from "../utils/fnc/bar/manufacturers";
import getManufacturersChartOptionDonut from "../utils/fnc/donut/manufacturers";
import getManufacturersChartOptionPie from "../utils/fnc/pie/manufacturers";
import getBitDepthValueStatPie from "../utils/fnc/pie/bitdepthvalue";
import getBitDepthValueStatDonut from "../utils/fnc/donut/bitdepthvalue";
import getBitDepthValueStatBar from "../utils/fnc/bar/bidepthvalue";
import getManufacturersChartOptionBarMixed from "../utils/fnc/mixed/manufaturers";
import getBitDepthValueStatMixed from "../utils/fnc/mixed/bidepthvalue";


export interface FetchConfig {
  [endpoint: string]: {
    [chart: string] : (data: any)=>Partial<ChartData>
  }
}

export const apiConfig: FetchConfig = {
  "manufacturers" : {
    "bar" : (data: any) => getManufacturersChartOptionBar(data),
    "donut" : (data: any) => getManufacturersChartOptionDonut(data),
    "pie" : (data: any) => getManufacturersChartOptionPie(data),
    "mixed" : (data: any) => getManufacturersChartOptionBarMixed(data),
  },
  "bitdepthvalue" : {
    "pie" : (data: any) => getBitDepthValueStatPie(data),
    "donut" : (data: any) => getBitDepthValueStatDonut(data),
    "bar" : (data: any) => getBitDepthValueStatBar(data),
    // "mixed" : (data: any) => getBitDepthValueStatMixed(data),
    "mixed" : (data: any) => getBitDepthValueStatBar(data),
  }
}


export const chartOptions: Partial<ChartOptions> = {

  series: [

  ],

  chart: {
    type: "bar"
  },

  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "80%"
    }
  },
  responsive: [{
    breakpoint: undefined,
    options: {},
  }],
  colors: ['#d4526e', '#13d8aa', '#A5978B', '#2b908f', '#f9a3a4',
    '#90ee7e', '#f48024', '#69d2e7', 'brown', 'blue', 'black', 'gold'
  ],
  dataLabels: {
    enabled: false
  },
  yaxis: {

  },
  xaxis: {
    categories: [

    ],
    title: {
      text: "example"
    }
  }
}





