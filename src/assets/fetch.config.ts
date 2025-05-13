import { ChartOptions } from "../utils/types/chart";
import { Observable } from "rxjs";
import { ApiService1 } from "../services/api.services1";
import getManufacturersChartOptionBar1 from "../utils/fnc1/manufacturers/manufacturers.bar";
import getComponentKindStatChartOptions1 from "../utils/fnc1/kinds";
import getManufacturersChartOptionDonut1 from "../utils/fnc1/manufacturers/manufacturers.donut";
import getManufacturersChartOptionBarMixed1 from "../utils/fnc1/manufacturers/manufaturers.mixed";
import getManufacturersChartOptionPie1 from "../utils/fnc1/manufacturers/manufacturers.pie";
import getComponentTypesStatChartOptionsDonut from "../utils/fnc1/statistic/statistic.donut";
import getBitDepthValueStatPie from "../utils/fnc1/bithdepthvalue/bitdepthvalue.pie";
import getBitDepthValueStatDonut from "../utils/fnc1/bithdepthvalue/bitdepthvalue.donut";
import getBitDepthValueStatBar from "../utils/fnc1/bithdepthvalue/bidepthvalue.bar";


export interface ChartOptionsStorage {
  [endpoint: string]: {
    [chart: string]: (data: any) => Partial<ChartOptions>
  }
}
export interface ObservableStorage {
  [chart: string]: (injector: ApiService1, data: Map<string, any>) => Observable<any> | null
}
export interface PropsStroage {
  [componentType: string]: string[]
}
export const chartOptionsData: ChartOptionsStorage = {
  "manufacturers": {
    "bar": (data: any) => getManufacturersChartOptionBar1(data),
    "donut": (data: any) => getManufacturersChartOptionDonut1(data),
    "pie": (data: any) => getManufacturersChartOptionPie1(data),
    "mixed": (data: any) => getManufacturersChartOptionBarMixed1(data),
  },
  "bitdepthvalue": {
    "pie": (data: any) => getBitDepthValueStatPie(data),
    "donut": (data: any) => getBitDepthValueStatDonut(data),
    "bar": (data: any) => getBitDepthValueStatBar(data),
    // "mixed" : (data: any) => getBitDepthValueStatMixed(data),
    "mixed": (data: any) => getBitDepthValueStatBar(data),
  },
  "componentTypes": {
    "bar": (data: any) => getManufacturersChartOptionBar1(data),
    "donut": (data: any) => getManufacturersChartOptionDonut1(data),
    "pie": (data: any) => getManufacturersChartOptionPie1(data),
    "mixed": (data: any) => getManufacturersChartOptionBarMixed1(data)
  },
  "componentKinds": {
    "bar": (data: any) => getComponentKindStatChartOptions1(data),
  },
  "statistic" : {
    "donut": (data: any) => getComponentTypesStatChartOptionsDonut(data)
  }
}
const observableApi: ObservableStorage = {
  "components": (injector: ApiService1, data: Map<string, any>) => injector.getComponentsApi(data),
  "bitdepthvalue": (injector: ApiService1, data: Map<string, any>) => injector.getBitDepthValue(data),
}
const propsNames: PropsStroage = {
  "Микросхема": ["битность"]
}

export const observableApiMap: Map<string, (injector: ApiService1, data: Map<string, any>) => Observable<any> | null> = new Map(Object.entries(observableApi));
export const propsNamesMap: Map<string, string[]> = new Map(Object.entries(propsNames));
export const defaultOptions: Partial<ChartOptions> = {
  series: [],
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



