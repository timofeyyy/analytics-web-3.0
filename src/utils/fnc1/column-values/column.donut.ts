import { ChartOptions } from "../../types/chart";
import getManufacturersChartOptionDonut1 from "../manufacturers/manufacturers.donut";



const getColumnDonutChartOptions = (data: any, query: Map<string, string>): Partial<ChartOptions> => {
    let apexChartData: Partial<ChartOptions> = {
        series: [],
        chart: {
            type: "donut",
            zoom: {
                enabled: true
            }
        },
        labels: [],
        legend: {
            show: false,
            position: 'bottom',
            horizontalAlign: 'center'
        },
        values: []
    };

    const map = new Map()
    const param = query.get('param')
    const manufacturerName = query.get('manufacturerName')
    const ruComponentType = query.get('ruComponentType')
    const all = query.get('all')
    if (param && ruComponentType) {
        for (const key in data) {
            for (const obj of data[key]) {
                if (obj.ruComponentType.toLowerCase() != ruComponentType.toLowerCase()) {
                    break;
                }
                const value = obj[param] ? `${obj[param]}` : 'Не указано'
                if (!obj[param] && all === "1") {
                    continue;
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
        apexChartData = getManufacturersChartOptionDonut1(data)
    }
    return apexChartData
}

export default getColumnDonutChartOptions