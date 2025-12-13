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
import { getDateStatisticBarAll } from "../fnc1/statistic/date-statistic-all.bar"
import { getDateStatisticSidesAll } from "../fnc1/statistic/date-statistic-all.sides"
import { getDateStatisticBar } from "../fnc1/statistic/date-statistic.bar"
import { getDateStatisticSides } from "../fnc1/statistic/date-statistic.sides"
import { getSelectionLadder } from "../fnc1/statistic/selection-ladder"
import getComponentTypesStatChartOptionsDonut from "../fnc1/statistic/statistic.donut"
import { componentStorage } from "../redux/component"
import { ChartOptions } from "../types/chart"


export const colorTypes = [
  { EnComponentType: "Microchip", color: "#008FFB" },
  { EnComponentType: "Capacitor", color: "#00E396" },
  { EnComponentType: "Diod", color: "#775DD0" },
  { EnComponentType: "Resistor", color: "#FEB019" },
  { EnComponentType: "Transistor", color: "#FF4560" },
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
  "RuComponentType": {
    chartData: {
      "bar": (data: any, query: Map<string, string>) => getManufacturersChartOptionBar1(data, query),
      "donut": (data: any) => getManufacturersChartOptionDonut1(data),
      "pie": (data: any) => getManufacturersChartOptionPie1(data),
      "mixed": (data: any) => getManufacturersChartOptionBarMixed1(data)
    },
    chartName: (data: any, query: Map<string, string>) => {
      let label = "Количественная статистика номенклатуры производителей по типам компонентов производетелей"
      let componentType = query.get('RuComponentType')
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
      const ManufacturerName = query.get('ManufacturerName')
      const alias = query.get('alias')
      let EnComponentType = query.get("EnComponentType")
      let manufacturerLabel
      if (ManufacturerName && param != 'ManufacturerName') {
        manufacturerLabel = `производителя "${ManufacturerName}"`
      }
      return `Количественная статистика компонентов параметра "${alias}" ${manufacturerLabel ?? ""} из числа компонентов (${data[EnComponentType!].length})`
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
      const ManufacturerName = query.get('ManufacturerName')
      const alias = query.get('alias')
      let EnComponentType = query.get("EnComponentType")
      let manufacturerLabel
      if (ManufacturerName && param != 'ManufacturerName') {
        manufacturerLabel = `производителя "${ManufacturerName}"`
      }
      return `Результат выбокри параметра "${alias}" из числа компонентов (${data[EnComponentType!].length})`
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

                queryStr += `RuComponentType=${res.values![opts.dataPointIndex]}`
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
  "date-compare": {
    chartData: {
      "sides": (data: any, query: Map<string, string>) => getDateStatisticSides(data, query),
      "bar": (data: any, query: Map<string, string>) => getDateStatisticBar(data, query)
    },
    chartName: (data: any, query: Map<string, string>) => {
      return `Сравнение парамаметра "${query.get('alias-param')}" компонентов "${query.get('RuComponentType')}" по двум датам`
    }
  },

  "date-compare-all": {
    chartData: {
      "sides": (data: any, query: Map<string, string>) => getDateStatisticSidesAll(data, query),
      "bar": (data: any, query: Map<string, string>) => getDateStatisticBarAll(data, query)
    },
    chartName: (data: any, query: Map<string, string>) => {
      return `Сравнение парамаметра "${query.get('alias-param')}" компонентов "${query.get('RuComponentType')}" по двум датам`
    }
  },
  "selection-ladder": {
    chartData: {
      "bar": (data: any, query: Map<string, string>) => getSelectionLadder(data, query)
    },
    chartName: (data: any, query: Map<string, string>) => {
      return "Изменение количества выбранных компонентов с добавлением приоритетов"
    }
  }
}