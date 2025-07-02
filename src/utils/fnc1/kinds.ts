import { ComponentTypeRuEnum } from "../enum/app.enum";
import { ChartOptions } from "../types/chart";

const getComponentKindStatChartOptions1 = (data: any): Partial<ChartOptions> => {
    let apexChartData: Partial<ChartOptions> = {
        series: [{
            name: "количество",
            data: []
        }],
        chart: {
            type: "bar",
            stacked: true,
            zoom: {
                enabled: true
            }
        },
        colors: ['#d4526e', '#13d8aa', '#A5978B', '#2b908f', '#f9a3a4',
            '#90ee7e', '#f48024', '#69d2e7', 'brown', 'blue', 'black', 'gold'
        ],
        dataLabels: {
            enabled: false
        },
        xaxis: {
            categories: [],
            tickPlacement: 'on',
            type: 'category',
            labels: {
                style: {
                    fontSize: '0px',

                },
            },
        },
        yaxis: {
            opposite: false,
            title: {
                text: "Количество"
            },
            labels: {
                formatter: (val) => {
                    return val + '%';
                }
            },
        },
        plotOptions: {
            bar: {
                horizontal: false
            }
        },
        values: []
    };
    let tmp: any = {}
    for (const key in data) {
        for (const obj of data[key]) {

            let categorieItemIndex: number = (apexChartData as ChartOptions).xaxis.categories.findIndex(
                (category: string) => category === obj.ruComponentKind
            )

            if (categorieItemIndex === -1) {
                (apexChartData as ChartOptions).xaxis.categories.push(obj.ruComponentKind)
                tmp[obj.ruComponentKind] = {
                    count: 0
                }

            }

            tmp[obj.ruComponentKind].count += 1

        }
    }

    (apexChartData as ChartOptions).xaxis.categories.forEach((category: string) => {
        if ((apexChartData as ChartOptions).series[0].data) {
            (apexChartData as ChartOptions).series[0].data.push(tmp[category].count)
        }
    })

    apexChartData.propName = "ruComponentKind"
    apexChartData.values = (apexChartData as ChartOptions).xaxis.categories;    
    return apexChartData;
}

export default getComponentKindStatChartOptions1