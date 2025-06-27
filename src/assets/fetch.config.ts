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
import { AppEnum, ComponentTypeRuEnum } from "../utils/enum/app.enum";
import { ComponentOptions } from "../utils/types/app";
import manufacturerNameFilters from "../utils/fnc1/filters/manufacturerName";
import componentKindFilters from "../utils/fnc1/filters/componentKind";
import componentTypeFilters from "../utils/fnc1/filters/componentType";
import getBitDepthValueStatMixed from "../utils/fnc1/bithdepthvalue/bidepthvalue.mixed";

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
  "bitDepthValue": {
    chartData: {
      "pie": (data: any) => getBitDepthValueStatPie(data),
      "donut": (data: any) => getBitDepthValueStatDonut(data),
      "bar": (data: any) => getBitDepthValueStatBar(data),
      "mixed": (data: any) => getBitDepthValueStatMixed(data),
      // "mixed": (data: any) => getBitDepthValueStatBar(data),
    },
    chartName: (data: any) => `Битность микроcхем производителя ${data.get('manufacturerName')}`
  },
  "ruComponentType": {
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

export const columnsMax = [
  "maxPermissibleAverageDirectCurrent",
  "maxiPermissibleDirectCurrent",
  "maxPermissibleDCVoltage",
  "maxPermissibleDCCollectorCurrent",
  "maxVoltage",
  "maxOperatingTemperature",
  "maxCapacity"
]

export const columnsMin = [
  "minCapacity",
  "minOperatingTemperature",
  "minVoltage",
  "consumptionCurrent"
]

export const prioritySchemaWrapper = {
  "Микросхема": "microchips",
  "Диод": "diods",
  "Транзистор": "transistors",
  "Конденсатор": "capacitors",
  "Резистор": "resistors"
}

const observableApi: ObservableStorage = {
  // "components1": (injector: ApiService1, data: Map<string, any>) => injector.getComponentsApiPreview(data),
  "components": (injector: ApiService1, data: Map<string, any>) => injector.getComponentsApiAll(data),
  "bitDepthValue": (injector: ApiService1, data: Map<string, any>) => injector.getBitDepthValue(data),
  "Микросхема": (injector: ApiService1, data: Map<string, any>) => injector.getMicrochips(data),
  "Транзистор": (injector: ApiService1, data: Map<string, any>) => injector.getTransistors(data),
  "Резистор": (injector: ApiService1, data: Map<string, any>) => injector.getTransistors(data),
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

const sortObj = {
  'manufacturerName': (props: any, all: ComponentOptions[]) => manufacturerNameFilters(props, all),
  'ruComponentKind': (props: any, all: ComponentOptions[]) => componentKindFilters(props, all)
}

export const sortObjMap: Map<string, any> = new Map(Object.entries(sortObj));

export const props = {
  'manufacturerName': {
    currentValue: AppEnum.ALL,
    input: false,
    sort: (props: any, all: ComponentOptions[]) => manufacturerNameFilters(props, all)
  },
  'ruComponentKind': {
    currentValue: AppEnum.ALL,
    input: false,
    sort: (props: any, all: ComponentOptions[]) => componentKindFilters(props, all)
  },
  'bitDepthValue': {
    currentValue: AppEnum.ALL,
    input: false
  },
  'ruTechnologyName': {
    currentValue: AppEnum.ALL,
    input: false
  },
  'frequency': {
    currentValue: "",
    input: true
  },
  'minOperatingTemperature': {
    currentValue: "",
    input: true
  },
  'maxOperatingTemperature': {
    currentValue: "",
    input: true
  },
  'radiationResistance': {
    currentValue: "",
    input: true
  },
  'radiationResistanceI': {
    currentValue: "",
    input: true
  },
  'samplingTime': {
    currentValue: "",
    input: true
  },
  'minVoltage': {
    currentValue: "",
    input: true
  },
  'maxVoltage': {
    currentValue: "",
    input: true
  },
  'outputType': {
    currentValue: AppEnum.ALL,
    input: false
  },
  'ruComponentType': {
    currentValue: AppEnum.ALL,
    input: false
  },
  'maxPermissibleAverageDirectCurrent': {
    currentValue: "",
    input: true
  },
  'maxiPermissibleDirectCurrent': {
    currentValue: "",
    input: true
  },
  'package': {
    currentValue: AppEnum.ALL,
    input: false
  },
  'maxPermissibleDCVoltage': {
    currentValue: "",
    input: true
  },
  'maxPermissibleDCCollectorCurrent': {
    currentValue: "",
    input: true
  },
  'qualication': {
    currentValue: "",
    input: true
  },
  'interfaces': {
    currentValue: "",
    input: true
  },
  'remark2': {
    currentValue: "",
    input: true
  },
  'remark1': {
    currentValue: "",
    input: true
  },
  'qualicationЕС': {
    currentValue: AppEnum.ALL,
    input: false
  },
  'qualicationSG': {
    currentValue: AppEnum.ALL,
    input: false
  },
  'minCapacity': {
    currentValue: "",
    input: true
  },
  'memoryFormat': {
    currentValue: AppEnum.ALL,
    input: false
  },
  'maxCapacity': {
    currentValue: "",
    input: true
  },
  'consumptionCurrent': {
    currentValue: "",
    input: true
  },
  'acceptableСapacityReduction': {
    currentValue: "",
    input: true
  },
  'acceptableCapacityIncrease': {
    currentValue: "",
    input: true
  }
}

const chartNames = {
  "donut": "Кольцевая диаграмма",
  "pie": "Круговая диаграмма",
  "bar": "Гистаграмма",
  "mixed": "График Парето"
}

const prioritySchema = {
  "microchips": [
    "consumptionCurrent",
    "qualication",
    "manufacturerName",
    "samplingTime",
    "minOperatingTemperature",
    "frequency",
    "minVoltage"
  ],
  "diods": [
    "minOperatingTemperature",
    "qualicationЕС",
    "manufacturerName",
    "radiationResistance",
    "maxOperatingTemperature",
    "maxPermissibleDCCollectorCurrent",
    "maxPermissibleDCVoltage",
    "package",
  ],
  "transistors": [
    "maxOperatingTemperature",
    "radiationResistance",
    "qualicationЕС",
    "maxPermissibleDCVoltage",
    "minOperatingTemperature",
    "maxiPermissibleDirectCurrent",
    "ruComponentKind",
    "manufacturerName",
    "package"
  ],
  "capacitors": [

  ],
  "resistors": [

  ]
}


//microchips 
// 200
// 7.К11- 60 МэВ см2/мг
// АО НТЦ Модуль
// -1.7976931348623157e+308
// -60
// 200
// 3
export const prioritySchemaMap: Map<string, string[]> = new Map(Object.entries(prioritySchema));
export const prioritySchemaWrapperMap: Map<string, string> = new Map(Object.entries(prioritySchemaWrapper));
export const chartNamesMap: Map<string, string> = new Map(Object.entries(chartNames));
export const propsMap: Map<string, any> = new Map(Object.entries(props));
export const observableApiMap: Map<string, (injector: ApiService1, data: Map<string, any>) => Observable<any> | null> = new Map(Object.entries(observableApi));
export const propsNamesMap: Map<string, ComponentProp[]> = new Map(Object.entries(propsNames));
export const defaultChartOptions: Partial<ChartOptions> = {
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
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: "bottom"
        }
      }
    }
  ],
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



