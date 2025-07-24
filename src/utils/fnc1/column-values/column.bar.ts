import { JsonPipe } from "@angular/common";
import { ChartOptions } from "../../types/chart";
import getMinMax from "../other/getMinMaxFromMap";
import existInColumnsMin from "../other/existInColumnsMin";
import existInColumnsMax from "../other/existsInColumnsMax";
import { AppEnum } from "../../enum/app.enum";
import getManufacturersChartOptionBar1 from "../manufacturers/manufacturers.bar";

const getColumnStatBarChartOptions = (data: any, query: Map<string, string>): Partial<ChartOptions> => {
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
    // const ParamMap = new Map()
    let param = query.get('param')
    let manufacturerName = query.get('manufacturerName')
    const ruComponentType = query.get('ruComponentType')
    if (param && ruComponentType) {
        for (const key in data) {
            for (const obj of data[key]) {
                if (obj.ruComponentType != ruComponentType) {
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
                    //     || (
                    //     paramValue &&
                    //     (existInColumnsMin(param) && !isNaN(Number(paramValue)) && obj[param] >= paramValue) ||
                    //     (existInColumnsMax(param) && !isNaN(Number(paramValue)) && obj[param] <= paramValue!) ||
                    //     (obj[param] == paramValue) ||
                    //     (obj[param] == Number(paramValue))
                    // )
                ) {

                    let categorieItemIndex: number = (apexChartData.xaxis?.categories as Array<string>).findIndex(
                        (category: string) => category === value
                    )
                    let seriesItemIndex: number = (apexChartData as ChartOptions).series.findIndex(
                        (item: any) => item.name === obj.ruComponentType
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


export default getColumnStatBarChartOptions