import { ChartOptions } from "../../types/chart";

const getManufacturersChartOptionBar1 = (data: any): Partial<ChartOptions> => {
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

    let tmp: any = {}
    //     if (Array.isArray(data)) {
    //         data.forEach((obj: ComponentLabel) => {
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

            if (tmp[obj.ruComponentType] === undefined) {
                tmp[obj.ruComponentType] = {}
            }

            if (tmp[obj.ruComponentType][obj.manufacturerName] === undefined) {
                tmp[obj.ruComponentType][obj.manufacturerName] = 0
            }

            tmp[obj.ruComponentType][obj.manufacturerName] += 1
            //         });

        }
    }


    (apexChartData as ChartOptions).series.forEach((seriesItem: any) => {
        let sum: number = 0;
        for (const key in tmp[seriesItem.name]) {
            sum += tmp[seriesItem.name][key]
        }

        ((apexChartData as ChartOptions).xaxis.categories as Array<string>).forEach((category: string) => {
            if (seriesItem.name != undefined && seriesItem.data) {
                let value: number = tmp[seriesItem.name][category] === undefined ? 0 : tmp[seriesItem.name][category]
                seriesItem.data.push((value * 100 / sum).toFixed(1))
            }
        })
    })
    //     }


    apexChartData.values = apexChartData.xaxis?.categories;
    return apexChartData;
}


export default getManufacturersChartOptionBar1