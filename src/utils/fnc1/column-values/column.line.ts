import { ChartOptions } from "../../types/chart";
import getManufacturersChartOptionLine1 from "../manufacturers/manufacturers.line";


const getColumnLineChartOptions = (data: any, query: Map<string, string>): Partial<ChartOptions> => {
    const values: any = [];
    const map = new Map();
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
                    fontSize: '0px'
                }
            }
        },
        tooltip: {
            x: {
                formatter: function (val: number, opts: any) {
                    const index = opts.dataPointIndex;
                    return `Значение параметра: ${values[index]}; Дата: ${apexChartData!.values![index]};`;
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
    const paramAlias = query.get('alias')
    const param = query.get('param')
    const manufacturerName = query.get('manufacturerName')
    const ruComponentType = query.get('ruComponentType')
    const all = query.get('all')

    if (param && ruComponentType) {
        apexChartData.series = [{
            name: paramAlias,
            data: []
        }]
        for (const key in data) {
            for (const obj of data[key]) {
                if (obj.ruComponentType.toLowerCase() != ruComponentType.toLowerCase()) {
                    break;
                }
                if (manufacturerName ? (obj[param] && obj.manufacturerName == manufacturerName) : obj[param] && obj[param]) {
                    if (!obj[param] && all === "1") {
                        continue;
                    }
                    const date = new Date(obj.date)
                    const dateStr = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
                    let categorieItemIndex: number = (apexChartData.xaxis?.categories as Array<string>).findIndex(
                        (category: string) => category == dateStr
                    )


                    if (categorieItemIndex === -1) {
                        (apexChartData as ChartOptions).xaxis.categories.push(dateStr)
                    }

                    if (map.get(dateStr) === undefined) {
                        map.set(dateStr, {})
                    }
                    if (map.get(dateStr)[`${obj[param]}`] === undefined) {
                        map.get(dateStr)[`${obj[param]}`] = 0
                    }
                    map.get(dateStr)[`${obj[param]}`] += 1
                }
            }
        }
        const categories = ((apexChartData as ChartOptions).xaxis.categories as Array<string>)
        const series = apexChartData.series![0]
        for (const category of categories) {
            const dateObj = map.get(category)
            const entries = Object.entries(dateObj).sort((a: any, b: any) => b[1] - a[1])
            if (!entries.length) {
                continue
            }
            const first = entries[0]
            // for (const element of entries) {
            //     if (element == firstValue) {

            //     }
            // }
            series.data.push((first as any)[1])
            values.push((first as any)[0])
        }
        apexChartData.values = apexChartData.xaxis?.categories;
        // .forEach((category: string) => {


        // const series = apexChartData.series![0]
        // if (series.name != undefined && series.data) {
        //     let value: number = map.get(series.name)[category] === undefined ? 0 : map.get(series.name)[category]
        //     series.data.push(value)
        // }
        // })

    }
    // else {
    //     apexChartData = getManufacturersChartOptionLine1(data)
    // }
    return apexChartData
}

export default getColumnLineChartOptions

