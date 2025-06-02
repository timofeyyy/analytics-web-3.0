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
import { ComponentTypeRuEnum } from "../utils/enum/app.enum";

export interface ComponentProp {
  value: string,
  allias: string
}

export interface ChartOptionsStorage {
  [endpoint: string]: {
    chartData: {
      [chart: string]: (data: any) => Partial<ChartOptions>
    },
    chartName: (data: any) => string
  }
}
export interface ObservableStorage {
  [chart: string]: (injector: ApiService1, data: Map<string, any>) => Observable<any> | null
}
export interface PropsStroage {
  [componentType: string]: ComponentProp[]
}
export interface AliasStorage {
  [propName: string]: string
}

export const chartOptionsData: ChartOptionsStorage = {
  "bitdepthvalue": {
    chartData: {
      "pie": (data: any) => getBitDepthValueStatPie(data),
      "donut": (data: any) => getBitDepthValueStatDonut(data),
      "bar": (data: any) => getBitDepthValueStatBar(data),
      // "mixed" : (data: any) => getBitDepthValueStatMixed(data),
      "mixed": (data: any) => getBitDepthValueStatBar(data),
    },
    chartName: (data: any) => `Битность микроcхем производителя ${data.get('manufacturerName')}`
  },
  "componentTypes": {
    chartData: {
      "bar": (data: any) => getManufacturersChartOptionBar1(data),
      "donut": (data: any) => getManufacturersChartOptionDonut1(data),
      "pie": (data: any) => getManufacturersChartOptionPie1(data),
      "mixed": (data: any) => getManufacturersChartOptionBarMixed1(data)
    },
    chartName: (data: any) => {
      let label = "Общая статистика по всем типам компонентам"
      let componentType = data.get('ruComponentType')
      if (componentType) {
        label = `Статистика по компоненту "${componentType}"`
      }
      return label
    }
  },
  "componentKinds": {
    chartData: {
      "bar": (data: any) => getComponentKindStatChartOptions1(data),
    },
    chartName: (data: any) => {
      let componentType = data.get('ruComponentType')
      let manufacturerName = data.get('manufacturerName')
      let label = ""

      if (componentType) {
        label = `Статистика вида компонентов типа "${componentType}"`
      }
      if (manufacturerName) {
        label = `Статистика вида компонентов производителя "${manufacturerName}"`
      }
      if (componentType && manufacturerName) {
        label = `Статистика вида компонентов производителя "${manufacturerName}" типа "${componentType}"`
      }
      return label
    }
  },
  "statistic": {
    chartData: {
      "donut": (data: any) => getComponentTypesStatChartOptionsDonut(data)
    },
    chartName: (data: any) => "Количественная статистка всех записей"
  }
}
ComponentTypeRuEnum.DIOD
const observableApi: ObservableStorage = {
  "components": (injector: ApiService1, data: Map<string, any>) => injector.getComponentsApi(data),
  "bitdepthvalue": (injector: ApiService1, data: Map<string, any>) => injector.getBitDepthValue(data),
  "Микросхема": (injector: ApiService1, data: Map<string, any>) => injector.getMicrochips(data),
  "Транзистор": (injector: ApiService1, data: Map<string, any>) => injector.getTransistors(data),
  "Резистор": (injector: ApiService1, data: Map<string, any>) => injector.getResistors(data),
  "Конденсатор": (injector: ApiService1, data: Map<string, any>) => injector.getCapacitors(data),
  "Диод": (injector: ApiService1, data: Map<string, any>) => injector.getDiods(data),
}
const propsNames: PropsStroage = {
  "Микросхема": [
    {
      value: "bitdepthvalue",
      allias: "битность"
    }
  ]
}

export const observableApiMap: Map<string, (injector: ApiService1, data: Map<string, any>) => Observable<any> | null> = new Map(Object.entries(observableApi));
export const propsNamesMap: Map<string, ComponentProp[]> = new Map(Object.entries(propsNames));
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



