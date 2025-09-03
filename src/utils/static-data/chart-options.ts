import getBitDepthValueStatBar from "../fnc1/bithdepthvalue/bidepthvalue.bar"
import getBitDepthValueStatMixed from "../fnc1/bithdepthvalue/bidepthvalue.mixed"
import getBitDepthValueStatDonut from "../fnc1/bithdepthvalue/bitdepthvalue.donut"
import getBitDepthValueStatPie from "../fnc1/bithdepthvalue/bitdepthvalue.pie"
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
import { ChartOptions } from "../types/chart"

interface ChartOptionsStorage {
  [endpoint: string]: {
    chartData: {
      [chart: string]: (data: any, query: Map<string, string>) => Partial<ChartOptions>
    },
    chartName: (data: any, query: Map<string, string>) => string
  }
}
export const chartOptionsData: ChartOptionsStorage = {
  "bitDepthValue": {
    chartData: {
      "pie": (data: any) => getBitDepthValueStatPie(data),
      "donut": (data: any) => getBitDepthValueStatDonut(data),
      "bar": (data: any) => getBitDepthValueStatBar(data),
      "mixed": (data: any) => getBitDepthValueStatMixed(data),
    },
    chartName: (data: any, query: Map<string, string>) => {
      return `Количественный график параметра битности микросхем по ${query.get('manufacturerName') ? 'производителю ' + query.get('manufacturerName') : 'по всем производителям'}`
    }
  },
  "bitDepthValue-filters": {
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
                window.parent.location.href = `/filters${queryStr}`
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
                window.parent.location.href = `/filters${queryStr}`
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
                window.parent.location.href = `/filters${queryStr}`
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
                window.parent.location.href = `/filters${queryStr}`
              }
            }
          }
        }
        res.back = true
        return res
      },
    },
    chartName: (data: any, query: Map<string, string>) => {
      return `Количественный график параметра битности микросхем по ${query.get('manufacturerName') ? 'производителю ' + query.get('manufacturerName') : 'по всем производителям'}`
    }
  },
  "ruComponentType": {
    chartData: {
      "bar": (data: any) => getManufacturersChartOptionBar1(data),
      "donut": (data: any) => getManufacturersChartOptionDonut1(data),
      "pie": (data: any) => getManufacturersChartOptionPie1(data),
      "mixed": (data: any) => getManufacturersChartOptionBarMixed1(data)
    },
    chartName: (data: any, query: Map<string, string>) => {
      let label = "Количественная статистика по всем типам компонентам производетелей"
      let componentType = query.get('ruComponentType')
      if (componentType) {
        label = `Количественная статистика производителей по компонентам типа "${componentType}"`
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
      const ruComponentType = query.get('ruComponentType')
      const manufacturerName = query.get('manufacturerName')
      const allias = query.get('allias')

      // let label = "Количественная статистика по всем типам компонентам производетелей"
      // let componentType = data.get('ruComponentType')
      // if (componentType) {
      //   label = `Количественная статистика производителей по компонентам типа "${componentType}"`
      // }
      return `Количественная статистика значений параметра ${allias}`
    }  
  },
  "column-value": {
    chartData: {
      "line": (data: any, query: Map<string, string>) => getColumnValueLineChartOptions(data, query),
    },
    chartName: (data: any, query: Map<string, string>) => {
      const allias = query.get('allias')
      const paramValue = query.get('paramValue')
      return `Актуальность выпускаемых компонентов со значением ${paramValue} парамаетром ${allias}`
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
                window.location.href = `chart/components/componentKinds-filters/bar${queryStr}`
                // router.navigateByUrl(`chart/components/componentKinds-filters/bar${queryStr}`).then(() => {
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
                window.location.href = `chart/components/componentKinds-filters/bar${queryStr}`
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
                window.location.href = `chart/components/componentKinds-filters/bar${queryStr}`
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
                window.location.href = `chart/components/componentKinds-filters/bar${queryStr}`
              }
            }
          }
        }
        return res
      }
    },
    chartName: (data: any, query: Map<string, string>) => {
      let label = "Количественная статистика по всем типам компонентам производетелей"
      let componentType = query.get('ruComponentType')
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
    chartName: (data: any, query: Map<string, string>) => {
      let componentType = query.get('ruComponentType')
      let manufacturerName = query.get('manufacturerName')
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
  "componentKinds-filters": {
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
                window.parent.location.href = `/filters${queryStr}`
              }
            }
          }
        }
        res.back = true
        return res
      },
    },
    chartName: (data: any, query: Map<string, string>) => {
      let componentType = query.get('ruComponentType')
      let manufacturerName = query.get('manufacturerName')
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
    chartName: (data: any, query: Map<string, string>) => "Соотношение типов компонентов к общему количеству"
  },
  "statistic-filters": {
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
                window.parent.location.href = `/filters${queryStr}`
              }
            }
          }
        }
        return res
      },
    },
    chartName: (data: any, query: Map<string, string>):string => {
      let length = 0
      for (const key in data) {
       length+=data[key].length
      }
      return `Соотношение типов компонентов к общему количеству (${length})`
    }
  }
}