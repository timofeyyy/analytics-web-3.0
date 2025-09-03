import { ChartOptions } from "../../types/chart";
import getManufacturersChartOptionLine1 from "../manufacturers/manufacturers.line";


const getColumnValueLineChartOptions = (data: any, query: Map<string, string>): Partial<ChartOptions> => {
    const apexChartData: Partial<ChartOptions> = {
        series: [],
        dataLabels: {
            enabled: false
        },
        chart: {
            type: "area",
            stacked: true,
            zoom: {
                enabled: true
            }
        },
        xaxis: {
            categories: [],
            labels: {
                style: {
                    fontSize: '.75vw'
                }
            }
        },
        tooltip: {
            x: {
                formatter: function (val: number, opts: any) {
                    return `${paramAlias} ${paramValue} ${val}`;
                },
            },
        },
        yaxis: {
            opposite: false,
            title: {
                text: ""
            },
            labels: {
                style: {
                    fontSize: '0.75vw'
                }
            }
        },
        values: []
    };
    const map = new Map();
    const paramAlias = query.get('allias')
    const param = query.get('param')
    const ruComponentType = query.get('ruComponentType')
    const paramValue = query.get('paramValue')

    if (param && paramValue && ruComponentType) {
        apexChartData.series = [{
            name: paramAlias,
            data: []
        }]
        for (const key in data) {
            for (const obj of data[key]) {
                if (obj.ruComponentType.toLowerCase() != ruComponentType.toLowerCase()) {
                    break;
                }
                if (obj[param] && `${obj[param]}` === paramValue) {
               
                    const date = new Date(obj.date)
                    const dateStr = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
                    let categorieItemIndex: number = (apexChartData.xaxis?.categories as Array<string>).findIndex(
                        (category: string) => category == dateStr
                    )

                    if (categorieItemIndex === -1) {
                        (apexChartData as ChartOptions).xaxis.categories.push(dateStr)
                    }

                    let quantity = map.get(dateStr)
                    if (quantity === undefined) {
                        quantity = 0
                    }
                    quantity++
                    map.set(dateStr, quantity)
                }
            }
        }
        const categories = ((apexChartData as ChartOptions).xaxis.categories as Array<string>)
        const series = apexChartData.series![0]
        for (const category of categories) {
            series.data.push(map.get(category))
        }
        apexChartData.values = apexChartData.xaxis?.categories;
        console.log(apexChartData)
    }
    // else {
    //     apexChartData = getManufacturersChartOptionLine1(data)
    // }
    return apexChartData
}

export default getColumnValueLineChartOptions

