import { ChartOptions } from "../../types/chart";
import getManufacturersChartOptionPie1 from "../manufacturers/manufacturers.pie";



const getColumnStatPieChartOptions = (data: any, query: Map<string, string>): Partial<ChartOptions> => {
    let apexChartData: Partial<ChartOptions> = {
        series: [],
        chart: {
            type: "pie",
            zoom: {
                enabled: true
            }
        },
        labels: [],
        legend: {
            show: true,
            position: 'bottom',
            horizontalAlign: 'center'
        },
        values: []
    };

    const map = new Map()
    let param = query.get('param')
    let manufacturerName = query.get('manufacturerName')
    const ruComponentType = query.get('ruComponentType')
    if (param && ruComponentType) {
        for (const key in data) {
            for (const obj of data[key]) {
                if (obj.ruComponentType.toLowerCase() != ruComponentType.toLowerCase()) {
                    break;
                }
                const value = obj[param] ? `${obj[param]}` : 'Не указано'

                if (value === undefined) {
                    for (const key in obj) {
                        if (key.toLocaleLowerCase() === param.toLowerCase()) {
                            param = key
                            break
                        }
                    }
                }

                if (
                    manufacturerName ?
                        (value && obj.manufacturerName == manufacturerName) :
                        value
                ) {

                    let labelsItemIndex: number = (apexChartData as ChartOptions).labels.findIndex(
                        (category: string) => category === value
                    )
                    if (labelsItemIndex === -1) {
                        (apexChartData as ChartOptions).labels.push(value)
                    }
                    if (map.get(value) === undefined) {
                        map.set(value, 0)
                    }
                    map.set(value, map.get(value) + 1)
                }
            }
        }
        (apexChartData as ChartOptions).labels.forEach((label: string) => {
            (apexChartData as ChartOptions).series.push(map.get(label));
        })

        apexChartData.values = apexChartData.labels
    }
    else {
        apexChartData = getManufacturersChartOptionPie1(data)
    }
    return apexChartData
}

export default getColumnStatPieChartOptions