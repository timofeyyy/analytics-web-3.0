import { ChartOptions } from "../../types/chart";
import getManufacturersChartOptionBar1 from "../manufacturers/manufacturers.bar";

const getColumnBarChartOptions = (data: any, query: Map<string, string>): Partial<ChartOptions> => {
    let apexChartData: Partial<ChartOptions> = {
        series: [],
        dataLabels: {
            enabled: false
        },
        chart: {
            type: "bar",
            stacked: true,
            zoom: {
                enabled: true
            }
        },
        xaxis: {
            categories: [],
            tickPlacement: 'on',
            type: 'category',
            labels: {
                formatter: (val) => {
                    return `${val}`;
                },
                style: {
                    fontSize: '0px',
                },
            }
        },
        yaxis: {
            opposite: false,
            title: {
                text: ""
            },
            labels: {
                // formatter: (val) => {
                //     return val + '%';
                // },
                style: {
                    fontSize: '0.75vw'
                }
            }
        },
        plotOptions: {
            bar: {
                horizontal: false
            }
        },
        values: []
    };
    const map = new Map();
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
                if(!obj[param] && all === "1") {
                    continue;
                }
                if (
                    manufacturerName ?
                        (value && obj.manufacturerName == manufacturerName) :
                        value
                ) {

                    let categorieItemIndex: number = (apexChartData.xaxis?.categories as Array<string>).findIndex(
                        (category: string) => category === value
                    )
                    let seriesItemIndex: number = (apexChartData as ChartOptions).series.findIndex(
                        (item: any) => item.name.toLowerCase() === obj.ruComponentType.toLowerCase()
                    )

                    if (categorieItemIndex === -1) {
                        // console.log(value);
                        (apexChartData as ChartOptions).xaxis.categories.push(value)
                    }
                    if (seriesItemIndex === -1 && apexChartData.series) {
                        apexChartData.series.push({
                            name: obj.ruComponentType,
                            data: []
                        })
                    }
                    if (map.get(obj.ruComponentType) === undefined) {
                        map.set(obj.ruComponentType, {})
                    }
                    if (map.get(obj.ruComponentType)[value] === undefined) {
                        map.get(obj.ruComponentType)[value] = 0
                    }
                    map.get(obj.ruComponentType)[value] += 1
                }
            }
        }
        (apexChartData as ChartOptions).series.forEach((seriesItem: any) => {
            ((apexChartData as ChartOptions).xaxis.categories as Array<string>).forEach((category: string) => {
                if (seriesItem.name != undefined && seriesItem.data) {
                    let value: number = map.get(seriesItem.name)[category] === undefined ? 0 : map.get(seriesItem.name)[category]
                    seriesItem.data.push(value)
                }
            })
        })
        apexChartData.values = apexChartData.xaxis?.categories;
    }
    else {
        apexChartData = getManufacturersChartOptionBar1(data)
    }

    return apexChartData;
}


export default getColumnBarChartOptions