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
import { AppEnum } from "../utils/enum/app.enum";
import { ComponentOptions } from "../utils/types/app";
import manufacturerNameFilters from "../utils/fnc1/filters/manufacturerName";
import componentKindFilters from "../utils/fnc1/filters/componentKind";
import getBitDepthValueStatMixed from "../utils/fnc1/bithdepthvalue/bidepthvalue.mixed";
import { Router } from "@angular/router";
import { input } from "@angular/core";

interface ComponentProp {
  value: string,
  allias: string
}

interface ChartOptionsStorage {
  [endpoint: string]: {
    chartData: {
      [chart: string]: (data: any, query: Map<string, string>) => Partial<ChartOptions>
    },
    chartName: (data: any) => string
  }
}
interface ObservableStorage {
  [chart: string]: (injector: ApiService1, data: Map<string, any>) => Observable<any> | null
}
// interface PropsStroage {
//   [componentType: string]: ComponentProp[]
// }
// interface AliasStorage {
//   [propName: string]: string
// }

export const chartOptionsData: ChartOptionsStorage = {
  "bitDepthValue": {
    chartData: {
      "pie": (data: any) => getBitDepthValueStatPie(data),
      "donut": (data: any) => getBitDepthValueStatDonut(data),
      "bar": (data: any) => getBitDepthValueStatBar(data),
      "mixed": (data: any) => getBitDepthValueStatMixed(data),
      // "mixed": (data: any) => getBitDepthValueStatBar(data),
    },
    chartName: (data: any) => {
      return `Количественный график параметра битности микросхем по ${data.get('manufacturerName') ? 'производителю ' + data.get('manufacturerName') : 'по всем производителям'}`
    }
  },
  "bitDepthValue-catalog": {
    chartData: {
      "pie": (data: any, query: Map<string, string>) => {
        const res = getBitDepthValueStatPie(data)
        if (res && res.chart) {
          res.chart = {
            ...res.chart,
            events: {
              dataPointSelection: (event, chartContext, opts) => {
                let queryStr = "?"
                query.forEach((value, key) => {
                  queryStr += `${key}=${value}&`
                })
                queryStr += `bitDepthValue=${res.values![opts.dataPointIndex]}`
                window.parent.location.href = `/catalog${queryStr}`
              }
            }
          }
        }
        res.back = true
        return res
      },
      "donut": (data: any, query: Map<string, string>) => {
        const res = getBitDepthValueStatDonut(data)
        if (res && res.chart) {
          res.chart = {
            ...res.chart,
            events: {
              dataPointSelection: (event, chartContext, opts) => {
                let queryStr = "?"
                query.forEach((value, key) => {
                  queryStr += `${key}=${value}&`
                })
                queryStr += `bitDepthValue=${res.values![opts.dataPointIndex]}`
                window.parent.location.href = `/catalog${queryStr}`
              }
            }
          }
        }
        res.back = true
        return res
      },
      "bar": (data: any, query: Map<string, string>) => {
        const res = getBitDepthValueStatBar(data)
        if (res && res.chart) {
          res.chart = {
            ...res.chart,
            events: {
              dataPointSelection: (event, chartContext, opts) => {
                let queryStr = "?"
                query.forEach((value, key) => {
                  queryStr += `${key}=${value}&`
                })
                queryStr += `bitDepthValue=${res.values![opts.dataPointIndex]}`
                window.parent.location.href = `/catalog${queryStr}`
              }
            }
          }
        }
        res.back = true
        return res
      },
      "mixed": (data: any, query: Map<string, string>) => {
        const res = getBitDepthValueStatMixed(data)
        if (res && res.chart) {
          res.chart = {
            ...res.chart,
            events: {
              dataPointSelection: (event, chartContext, opts) => {
                let queryStr = "?"
                query.forEach((value, key) => {
                  queryStr += `${key}=${value}&`
                })
                queryStr += `bitDepthValue=${res.values![opts.dataPointIndex]}`
                window.parent.location.href = `/catalog${queryStr}`
              }
            }
          }
        }
        res.back = true
        return res
      },
    },
    chartName: (data: any) => {
      return `Количественный график параметра битности микросхем по ${data.get('manufacturerName') ? 'производителю ' + data.get('manufacturerName') : 'по всем производителям'}`
    }
  },
  "ruComponentType": {
    chartData: {
      "bar": (data: any) => getManufacturersChartOptionBar1(data),
      "donut": (data: any) => getManufacturersChartOptionDonut1(data),
      "pie": (data: any) => getManufacturersChartOptionPie1(data),
      "mixed": (data: any) => getManufacturersChartOptionBarMixed1(data)
    },
    chartName: (data: any) => {
      let label = "Количественная статистика по всем типам компонентам производетелей"
      let componentType = data.get('ruComponentType')
      if (componentType) {
        label = `Количественная статистика производителей по компонентам типа "${componentType}"`
      }
      return label
    }
  },
  "ruComponentType-next-chart": {
    chartData: {
      "bar": (data: any, query: Map<string, string>) => {
        const res = getManufacturersChartOptionBar1(data)
        if (res && res.chart) {
          res.chart = {
            ...res.chart,
            events: {
              dataPointSelection: (event, chartContext, opts) => {
                let queryStr = "?"
                query.forEach((value, key) => {
                  queryStr += `${key}=${value}&`
                })
                queryStr += `manufacturerName=${res.values![opts.dataPointIndex]}`
                window.location.href = `chart/components/componentKinds-catalog/bar${queryStr}`
                // router.navigateByUrl(`chart/components/componentKinds-catalog/bar${queryStr}`).then(() => {
                //   window.location.reload();
                // });
              }
            }
          }
        }
        return res
      },
      "donut": (data: any, query: Map<string, string>) => {
        const res = getManufacturersChartOptionDonut1(data)
        if (res && res.chart) {
          res.chart = {
            ...res.chart,
            events: {
              dataPointSelection: (event, chartContext, opts) => {
                let queryStr = "?"
                query.forEach((value, key) => {
                  queryStr += `${key}=${value}&`
                })
                queryStr += `manufacturerName=${res.values![opts.dataPointIndex]}`
                window.location.href = `chart/components/componentKinds-catalog/bar${queryStr}`
                // router.navigateByUrl(`chart/components/componentKinds/donut${queryStr}`).then(() => {
                //   window.location.reload();
                // });
              }
            }
          }
        }
        return res
      },
      "pie": (data: any, query: Map<string, string>) => {
        const res = getManufacturersChartOptionPie1(data)
        if (res && res.chart) {
          res.chart = {
            ...res.chart,
            events: {
              dataPointSelection: (event, chartContext, opts) => {
                let queryStr = "?"
                query.forEach((value, key) => {
                  queryStr += `${key}=${value}&`
                })
                queryStr += `manufacturerName=${res.values![opts.dataPointIndex]}`
                // router.navigateByUrl(`chart/components/componentKinds/pie${queryStr}`).then(() => {
                //   window.location.reload();
                // });
                window.location.href = `chart/components/componentKinds-catalog/bar${queryStr}`
              }
            }
          }
        }
        return res
      },
      "mixed": (data: any, query: Map<string, string>) => {
        const res = getManufacturersChartOptionBarMixed1(data)
        if (res && res.chart) {
          res.chart = {
            ...res.chart,
            events: {
              dataPointSelection: (event, chartContext, opts) => {
                let queryStr = "?"
                query.forEach((value, key) => {
                  queryStr += `${key}=${value}&`
                })
                queryStr += `manufacturerName=${res.values![opts.dataPointIndex]}`
                // router.navigateByUrl(`chart/components/componentKinds/mixed${queryStr}`).then(() => {
                //   window.location.reload();
                // });
                window.location.href = `chart/components/componentKinds-catalog/bar${queryStr}`
              }
            }
          }
        }
        return res
      }
    },
    chartName: (data: any) => {
      let label = "Количественная статистика по всем типам компонентам производетелей"
      let componentType = data.get('ruComponentType')
      if (componentType) {
        label = `Количественная статистика производителей по компонентам типа "${componentType}"`
      }
      return label
    }
  },
  "componentKinds": {
    chartData: {
      "bar": (data: any, query: Map<string, string>) => getComponentKindStatChartOptions1(data),
    },
    chartName: (data: any) => {
      let componentType = data.get('ruComponentType')
      let manufacturerName = data.get('manufacturerName')
      let label = ""

      if (componentType) {
        label = `Количественная статистика видов компонентов`
      }
      if (manufacturerName) {
        label = `Количественная статистика видов компонентов производителя "${manufacturerName}"`
      }
      if (componentType && manufacturerName) {
        label = `Количественная статистика видов компонентов производителя "${manufacturerName}"`
      }
      return label
    }
  },
  "componentKinds-catalog": {
    chartData: {
      "bar": (data: any, query: Map<string, string>) => {
        const res = getComponentKindStatChartOptions1(data)
        if (res && res.chart) {
          res.chart = {
            ...res.chart,
            events: {
              dataPointSelection: (event, chartContext, opts) => {
                let queryStr = "?"
                query.forEach((value, key) => {
                  queryStr += `${key}=${value}&`
                })
                queryStr += `ruComponentKind=${res.values![opts.dataPointIndex]}`
                window.parent.location.href = `/catalog${queryStr}`
              }
            }
          }
        }
        res.back = true
        return res
      },
    },
    chartName: (data: any) => {
      let componentType = data.get('ruComponentType')
      let manufacturerName = data.get('manufacturerName')
      let label = ""

      if (componentType) {
        label = `Количественная статистика видов компонентов`
      }
      if (manufacturerName) {
        label = `Количественная статистика видов компонентов производителя "${manufacturerName}"`
      }
      if (componentType && manufacturerName) {
        label = `Количественная статистика видов компонентов производителя "${manufacturerName}"`
      }
      return label
    }
  },
  "statistic": {
    chartData: {
      "donut": (data: any, query: Map<string, string>) => getComponentTypesStatChartOptionsDonut(data),
    },
    chartName: (data: any) => "Соотношение типов компонентов к общему количеству"
  },
  "statistic-catalog": {
    chartData: {
      "donut": (data: any, query: Map<string, string>) => {
        const res = getComponentTypesStatChartOptionsDonut(data)
        if (res && res.chart) {
          res.chart = {
            ...res.chart,
            events: {
              dataPointSelection: (event, chartContext, opts) => {
                let queryStr = "?"
                query.forEach((value, key) => {
                  queryStr += `${key}=${value}&`
                })
                queryStr += `ruComponentType=${res.values![opts.dataPointIndex]}`
                window.parent.location.href = `/catalog${queryStr}`
              }
            }
          }
        }
        return res
      },
    },
    chartName: (data: any) => "Соотношение типов компонентов к общему количеству"
  }
}

export const columnsMax = [
  "maxPermissibleAverageDirectCurrent",
  "maxiPermissibleDirectCurrent",
  "maxPermissibleDCVoltage",
  "maxPermissibleDCCollectorCurrent",
  "maxVoltage",
  "maxOperatingTemperature",
  "maxCapacity",
  "maxRatedResistance"
]

export const columnsMin = [
  "minCapacity",
  "minOperatingTemperature",
  "minVoltage",
  "minRatedResistance"
]
//временно
export const prioritySchemaWrapper = {
  "Микросхема": "microchips",
  "Диод": "diods",
  "Транзистор": "transistors",
  "Конденсатор": "capacitors",
  "Резистор": "resistors"
}
//временно
export const prioritySchemaWrapper2 = {
  "microchips": "Микросхема",
  "diods": "Диод",
  "transistors": "Транзистор",
  "capacitors": "Конденсатор",
  "resistors": "Резистор"
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
// const propsNames: PropsStroage = {
//   "Микросхема": [
//     {
//       value: "bitdepthvalue",
//       allias: "битность"
//     }
//   ]
// }

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
  },
  'powerRating': {
    currentValue: "",
    input: true
  },
  'currentLimit': {
    currentValue: "",
    input: true
  },
  'maxRatedResistance': {
    currentValue: "",
    input: true
  },
  'minRatedResistance': {
    currentValue: "",
    input: true
  },
  'resistanceTolerance': {
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
    "qualicationSG",
    "minCapacity",
    "maxCapacity",
    "acceptableСapacityReduction",
    "acceptableCapacityIncrease",
    "manufacturerName",
    "outputType",
    "maxOperatingTemperature",
    "maxVoltage",
    "ruComponentKind"

  ],
  "resistors": [
    "powerRating",
    "minRatedResistance",
    "maxRatedResistance",
    "manufacturerName",
    "currentLimit",
    "resistanceTolerance",
    "maxOperatingTemperature",
    "maxVoltage"
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
export const prioritySchemaWrapper2Map: Map<string, string> = new Map(Object.entries(prioritySchemaWrapper2));
export const chartNamesMap: Map<string, string> = new Map(Object.entries(chartNames));
export const propsMap: Map<string, any> = new Map(Object.entries(props));
export const observableApiMap: Map<string, (injector: ApiService1, data: Map<string, any>) => Observable<any> | null> = new Map(Object.entries(observableApi));
// export const propsNamesMap: Map<string, ComponentProp[]> = new Map(Object.entries(propsNames));



