import { ChartOptions } from "../../types/chart";

const getManufacturersChartOptionLine1 = (data: any): Partial<ChartOptions> => {
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
                formatter: (val) => {
                    return val + '%';
                },
                // style: {
                //     fontSize: '0.75vw'
                // }
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
    var manufacturersMap = new Map()
    for (const key in data) {
        for (const obj of data[key]) {
            let categorieItemIndex: number = (apexChartData.xaxis?.categories as Array<string>).findIndex(
                (category: string) => category === obj.manufacturerName
            )
            let seriesItemIndex: number = (apexChartData as ChartOptions).series.findIndex(
                (item: any) => item.name === obj.ruComponentType
            )
            if (categorieItemIndex === -1) {
                (apexChartData as ChartOptions).xaxis.categories.push(obj.manufacturerName)
            }
            if (seriesItemIndex === -1 && apexChartData.series) {
                apexChartData.series.push({
                    name: obj.ruComponentType,
                    data: []
                })
            }
            if (manufacturersMap.get(obj.manufacturerName) === undefined) {
                manufacturersMap.set(obj.manufacturerName, 0)
            }
            manufacturersMap.set(obj.manufacturerName, manufacturersMap.get(obj.manufacturerName) + 1)

            if (map.get(obj.ruComponentType) === undefined) {
                map.set(obj.ruComponentType, {})
            }
            if (map.get(obj.ruComponentType)[obj.manufacturerName] === undefined) {
                map.get(obj.ruComponentType)[obj.manufacturerName] = 0
            }
            map.get(obj.ruComponentType)[obj.manufacturerName] += 1
        }
    }

    (apexChartData as ChartOptions).series.forEach((seriesItem: any) => {
        let sum: number = 0;
        for (const key in map.get(seriesItem.name)) {
            sum += map.get(seriesItem.name)[key]
        }
        ((apexChartData as ChartOptions).xaxis.categories as Array<string>).forEach((category: string) => {
            if (seriesItem.name != undefined && seriesItem.data) {
                let value: number = map.get(seriesItem.name)[category] === undefined ? 0 : map.get(seriesItem.name)[category]
                seriesItem.data.push((value * 100 / sum).toFixed(1))
            }
        })
    })
    // const sortedMap = new Map([...manufacturersMap.entries()].sort((a, b) => b[1] - a[1]));
    // let res = getMinMax(sortedMap)
    // window.localStorage.setItem('mapWithMaxValues', JSON.stringify(Object.fromEntries(res.max)))
    // window.localStorage.setItem('mapWithMinValues', JSON.stringify(Object.fromEntries(res.min)))
    apexChartData.values = apexChartData.xaxis?.categories;
    return apexChartData;
}


export default getManufacturersChartOptionLine1