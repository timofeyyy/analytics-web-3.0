import getColumnValueLineChartOptions from "../fnc1/column-values/column-value.line"
import getColumnBarChartOptions from "../fnc1/column-values/column.bar"
import getColumnDonutChartOptions from "../fnc1/column-values/column.donut"
import getColumnLineChartOptions from "../fnc1/column-values/column.line"
import getColumnMixedChartOptions from "../fnc1/column-values/column.mixed"
import getColumnPieChartOptions from "../fnc1/column-values/column.pie"
import getComponentKindStatChartOptions1 from "../fnc1/kinds"
import getManufacturersChartOptionBar1 from "../fnc1/manufacturers/manufacturers.bar"
import getManufacturersChartOptionDonut1 from "../fnc1/manufacturers/manufacturers.donut"
import getManufacturersChartOptionPie1 from "../fnc1/manufacturers/manufacturers.pie"
import getManufacturersChartOptionBarMixed1 from "../fnc1/manufacturers/manufaturers.mixed"
import getComponentTypesStatChartOptionsDonut from "../fnc1/statistic/statistic.donut"
import { componentStorage } from "../redux/component"
import { ChartOptions } from "../types/chart"


export const colorTypes = [
    { enComponentType: "microchip", color :"#008FFB"},
    { enComponentType: "capacitor", color :"#00E396"},
    { enComponentType: "diod", color :"#775DD0"},
    { enComponentType: "resistor", color :"#FEB019"},
    { enComponentType: "transistor", color :"#FF4560"},
]

interface ChartOptionsStorage {
  [endpoint: string]: {
    chartData: {
      [chart: string]: (data: any, query: Map<string, string>) => Partial<ChartOptions>
    },
    chartName: (data: any, query: Map<string, string>) => string
  }
}
export const chartOptionsData: ChartOptionsStorage = {
  "ruComponentType": {
    chartData: {
      "bar": (data: any, query: Map<string, string>) => getManufacturersChartOptionBar1(data, query),
      "donut": (data: any) => getManufacturersChartOptionDonut1(data),
      "pie": (data: any) => getManufacturersChartOptionPie1(data),
      "mixed": (data: any) => getManufacturersChartOptionBarMixed1(data)
    },
    chartName: (data: any, query: Map<string, string>) => {
      let label = "Количественная статистика номенклатуры производителей по типам компонентов производетелей"
      let componentType = query.get('ruComponentType')
      if (componentType) {
        label = `Количественная статистика номенклатуры производителей по компонентов типа "${componentType}"`
      }
      return label
    }
  },
  "column": {
    chartData: {
      "bar": (data: any, query: Map<string, string>) => getColumnBarChartOptions(data, query),
      "donut": (data: any, query: Map<string, string>) => getColumnDonutChartOptions(data, query),
      "pie": (data: any, query: Map<string, string>) => getColumnPieChartOptions(data, query),
      "line": (data: any, query: Map<string, string>) => getColumnLineChartOptions(data, query),
      "mixed": (data: any, query: Map<string, string>) => getColumnMixedChartOptions(data, query),
    },
    chartName: (data: any, query: Map<string, string>) => {
      const param = query.get('param')
      const manufacturerName = query.get('manufacturerName')
      const alias = query.get('alias')
      let enComponentType = query.get("enComponentType")
      let manufacturerLabel
      if (manufacturerName && param != 'manufacturerName') {
        manufacturerLabel = `производителя "${manufacturerName}"`
      }
      return `Количественная статистика компонентов параметра "${alias}" ${manufacturerLabel ?? ""} из числа компонентов (${data[enComponentType!.toLowerCase()].length})`
    }
  },
  "column-final": {
    chartData: {
      "bar": (data: any, query: Map<string, string>) => getColumnBarChartOptions(data, query),
      "donut": (data: any, query: Map<string, string>) => getColumnDonutChartOptions(data, query),
      "pie": (data: any, query: Map<string, string>) => getColumnPieChartOptions(data, query),
      "line": (data: any, query: Map<string, string>) => getColumnLineChartOptions(data, query),
      "mixed": (data: any, query: Map<string, string>) => getColumnMixedChartOptions(data, query),
    },
    chartName: (data: any, query: Map<string, string>) => {
      const param = query.get('param')
      const manufacturerName = query.get('manufacturerName')
      const alias = query.get('alias')
      let enComponentType = query.get("enComponentType")
      let manufacturerLabel
      if (manufacturerName && param != 'manufacturerName') {
        manufacturerLabel = `производителя "${manufacturerName}"`
      }
      return `Результат выбокри параметра "${alias}" из числа компонентов (${data[enComponentType!.toLowerCase()].length})`
    }
  },
  "statistic-filters": {
    chartData: {
      "donut": (data: any, query: Map<string, string>) => {
        const res = getComponentTypesStatChartOptionsDonut(data, query)
        if (res && res.chart) {
          res.chart = {
            ...res.chart,
            events: {
              dataPointSelection: (event, chartContext, opts) => {
                let queryStr = "?"
                query.forEach((value, key) => {
                  let parsedValue;

                  try {
                    parsedValue = JSON.parse(value);
                  } catch {
                    parsedValue = value;
                  }

                  if (Array.isArray(parsedValue)) {
                    // // // console.log(`${key} — это массив`);
                  } else if (typeof parsedValue === "object" && parsedValue !== null) {
                    // // // console.log(`${key} — это объект`);
                  } else {
                    queryStr += `${key}=${value}&`;
                  }

                })

                queryStr += `ruComponentType=${res.values![opts.dataPointIndex]}`
                // window.parent.location.href = `/filters${queryStr}`
              }
            }
          }
        }
        return res
      },
    },
    chartName: (data: any, query: Map<string, string>): string => {
      let length = 0
      for (const key in data) {
        length += data[key].length
      }
      return `Соотношение типов компонентов к общему количеству (${length})`
    }
  },
  //  "column-line": {
  //   chartData: {
  //     "line": (data: any, query: Map<string, string>) => getColumnLineChartOptions(data, query),
  //   },
  //   chartName: (data: any, query: Map<string, string>) => {
  //     // const param = query.get('param')
  //     // const ruComponentType = query.get('ruComponentType')
  //     // const manufacturerName = query.get('manufacturerName')
  //     // const alias = query.get('alias')
  //     // const componentTypes: any = componentStorage.getState().componentTypes
  //     // let enComponentType
  //     // for (const type of componentTypes) {
  //     //   if (type.ruComponentType === ruComponentType) {
  //     //     enComponentType = type.enComponentType
  //     //     break
  //     //   }
  //     // }
  //     // let manufacturerLabel
  //     // if (manufacturerName && param != 'manufacturerName') {
  //     //   manufacturerLabel = `производителя "${manufacturerName}"`
  //     // }
  //     // return `Изменение наиболее используемого значения параметра "${alias}" ${manufacturerLabel ?? ""} со временем`
  //     return ''
  //   }
  // },
  //   "column-value": {
  //   chartData: {
  //     "line": (data: any, query: Map<string, string>) => getColumnValueLineChartOptions(data, query),
  //   },
  //   chartName: (data: any, query: Map<string, string>) => {
  //     const param = query.get('param')
  //     const alias = query.get('alias')
  //     const paramValue = query.get('paramValue')
  //     const manufacturerName = query.get('manufacturerName')
  //     let enComponentType = ""
  //     for (const key in data) {
  //       if (data[key].length) {
  //         enComponentType = data[key][0].enComponentType
  //       }
  //     }
  //     let manufacturerLabel
  //     if (manufacturerName && param != 'manufacturerName') {
  //       manufacturerLabel = `производителя "${manufacturerName}"`
  //     }
  //     // return `Изменение количества выпускаемых компонентов значения "${paramValue}" парамаетра "${alias}" со временем`
  //     return `Изменение параметра "${alias}" ${manufacturerLabel ?? ""} со временем`
  //   }
  // },
  // "ruComponentType-next-chart": {
  //   chartData: {
  //     "bar": (data: any, query: Map<string, string>) => {
  //       const res = getManufacturersChartOptionBar1(data, query)
  //       if (res && res.chart) {
  //         res.chart = {
  //           ...res.chart,
  //           events: {
  //             dataPointSelection: (event, chartContext, opts) => {
  //               let queryStr = "?"
  //               query.forEach((value, key) => {
  //                 queryStr += `${key}=${value}&`
  //               })
  //               queryStr += `manufacturerName=${res.values![opts.dataPointIndex]}`
  //               window.location.href = `chart/components/componentKinds-filters/bar${queryStr}`
  //               // router.navigateByUrl(`chart/components/componentKinds-filters/bar${queryStr}`).then(() => {
  //               //   window.location.reload();
  //               // });
  //             }
  //           }
  //         }
  //       }
  //       return res
  //     },
  //     "donut": (data: any, query: Map<string, string>) => {
  //       const res = getManufacturersChartOptionDonut1(data)
  //       if (res && res.chart) {
  //         res.chart = {
  //           ...res.chart,
  //           events: {
  //             dataPointSelection: (event, chartContext, opts) => {
  //               let queryStr = "?"
  //               query.forEach((value, key) => {
  //                 queryStr += `${key}=${value}&`
  //               })
  //               queryStr += `manufacturerName=${res.values![opts.dataPointIndex]}`
  //               window.location.href = `chart/components/componentKinds-filters/bar${queryStr}`
  //               // router.navigateByUrl(`chart/components/componentKinds/donut${queryStr}`).then(() => {
  //               //   window.location.reload();
  //               // });
  //             }
  //           }
  //         }
  //       }
  //       return res
  //     },
  //     "pie": (data: any, query: Map<string, string>) => {
  //       const res = getManufacturersChartOptionPie1(data)
  //       if (res && res.chart) {
  //         res.chart = {
  //           ...res.chart,
  //           events: {
  //             dataPointSelection: (event, chartContext, opts) => {
  //               let queryStr = "?"
  //               query.forEach((value, key) => {
  //                 queryStr += `${key}=${value}&`
  //               })
  //               queryStr += `manufacturerName=${res.values![opts.dataPointIndex]}`
  //               // router.navigateByUrl(`chart/components/componentKinds/pie${queryStr}`).then(() => {
  //               //   window.location.reload();
  //               // });
  //               window.location.href = `chart/components/componentKinds-filters/bar${queryStr}`
  //             }
  //           }
  //         }
  //       }
  //       return res
  //     },
  //     "mixed": (data: any, query: Map<string, string>) => {
  //       const res = getManufacturersChartOptionBarMixed1(data)
  //       if (res && res.chart) {
  //         res.chart = {
  //           ...res.chart,
  //           events: {
  //             dataPointSelection: (event, chartContext, opts) => {
  //               let queryStr = "?"
  //               query.forEach((value, key) => {
  //                 queryStr += `${key}=${value}&`
  //               })
  //               queryStr += `manufacturerName=${res.values![opts.dataPointIndex]}`
  //               // router.navigateByUrl(`chart/components/componentKinds/mixed${queryStr}`).then(() => {
  //               //   window.location.reload();
  //               // });
  //               window.location.href = `chart/components/componentKinds-filters/bar${queryStr}`
  //             }
  //           }
  //         }
  //       }
  //       return res
  //     }
  //   },
  //   chartName: (data: any, query: Map<string, string>) => {
  //     let label = "Количественная статистика номенклатуры производителей по всем типам компонентов"
  //     let componentType = query.get('ruComponentType')
  //     if (componentType) {
  //       label = `Количественная статистика номенклатры производителей по компонентам типа "${componentType}"`
  //     }
  //     return label
  //   }
  // },
  // "componentKinds": {
  //   chartData: {
  //     "bar": (data: any, query: Map<string, string>) => getComponentKindStatChartOptions1(data),
  //   },
  //   chartName: (data: any, query: Map<string, string>) => {
  //     let componentType = query.get('ruComponentType')
  //     let manufacturerName = query.get('manufacturerName')
  //     let label = ""

  //     if (componentType) {
  //       label = `Количественная статистика видов компонентов`
  //     }
  //     if (manufacturerName) {
  //       label = `Количественная статистика видов компонентов производителя "${manufacturerName}"`
  //     }
  //     if (componentType && manufacturerName) {
  //       label = `Количественная статистика видов компонентов производителя "${manufacturerName}"`
  //     }
  //     return label
  //   }
  // },
  // "componentKinds-filters": {
  //   chartData: {
  //     "bar": (data: any, query: Map<string, string>) => {
  //       const res = getComponentKindStatChartOptions1(data)
  //       if (res && res.chart) {
  //         res.chart = {
  //           ...res.chart,
  //           events: {
  //             dataPointSelection: (event, chartContext, opts) => {
  //               let queryStr = "?"
  //               query.forEach((value, key) => {
  //                 queryStr += `${key}=${value}&`
  //               })
  //               queryStr += `ruComponentKind=${res.values![opts.dataPointIndex]}`
  //               window.parent.location.href = `/filters${queryStr}`
  //             }
  //           }
  //         }
  //       }
  //       res.back = true
  //       return res
  //     },
  //   },
  //   chartName: (data: any, query: Map<string, string>) => {
  //     let componentType = query.get('ruComponentType')
  //     let manufacturerName = query.get('manufacturerName')
  //     let label = ""

  //     if (componentType) {
  //       label = `Количественная статистика видов компонентов`
  //     }
  //     if (manufacturerName) {
  //       label = `Количественная статистика видов компонентов производителя "${manufacturerName}"`
  //     }
  //     if (componentType && manufacturerName) {
  //       label = `Количественная статистика видов компонентов производителя "${manufacturerName}"`
  //     }
  //     return label
  //   }
  // },
  // "statistic": {
  //   chartData: {
  //     "donut": (data: any, query: Map<string, string>) => getComponentTypesStatChartOptionsDonut(data, query),
  //   },
  //   chartName: (data: any, query: Map<string, string>) => "Соотношение типов компонентов к общему количеству"
  // },
  
}