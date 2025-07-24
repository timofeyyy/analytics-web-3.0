import { JsonPipe } from "@angular/common";
import { ChartOptions } from "../../types/chart";
import getMinMax from "../other/getMinMaxFromMap";
import getManufacturersChartOptionBarMixed1 from "../manufacturers/manufaturers.mixed";

const getColumnStatMixedChartOptions = (data: any, query: Map<string, string>): Partial<ChartOptions> => {
    let apexChartData: Partial<ChartOptions> = {
        series: [{
            name: "количество",
            type: "column",
            data: []
        },
        {
            name: "проценты",
            type: "line",
            data: []
        }],
        dataLabels: {
            enabled: false
        },
        chart: {
            type: "line",
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
            }
        },
        plotOptions: {
            bar: {
                horizontal: false
            }
        },
        values: []
    };

    var map = new Map();
    let length = 0
    let param = query.get('param')
    let manufacturerName = query.get('manufacturerName')
    const ruComponentType = query.get('ruComponentType')
    if (param && ruComponentType) {
        for (const key in data) {
            length += data[key].length
            for (const obj of data[key]) {
                if (obj.ruComponentType != ruComponentType) {
                    break;
                }
                const value = obj[param] ? obj[param] : 'Не указано'
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
                    if (!map.has(value)) {
                        map.set(value, 0);
                    }
                    map.set(value, map.get(value) + 1)
                }
            }
        }
        const sortedMap = new Map([...map.entries()].sort((a, b) => b[1] - a[1]));
        let sum = 0
        sortedMap.forEach((value, key) => {
            (apexChartData as ChartOptions).xaxis.categories.push(key);
            (apexChartData as ChartOptions).series[0].data.push(value.toFixed(0));
            sum += (value * 100 / length);
            (apexChartData as ChartOptions).series[1].data.push(sum.toFixed(1) as any);
        });
    }
    else {
        apexChartData = getManufacturersChartOptionBarMixed1(data)
    }
    apexChartData.values = apexChartData.xaxis?.categories;
    return apexChartData;
}


export default getColumnStatMixedChartOptions
