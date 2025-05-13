import { ComponentLabel } from "../../types/app";
import { ChartOptions } from "../../types/chart";



const getManufacturersChartOptionBarMixed1 = (data: any): Partial<ChartOptions> => {
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
            labels: {
                style: {
                    fontSize: '0px',

                },
            }
        },
        yaxis: [{
            opposite: false,
            title: {
                text: ""
            }
        }
            , {
            opposite: true,
            title: {
                text: ""
            },
            labels: {
                formatter: (val) => {
                    return val + '%';
                }
            }
        }],
        plotOptions: {
            bar: {
                horizontal: false
            }
        },
        values: []
    };
    var map = new Map();

    if (Array.isArray(data)) {
        data.forEach((obj: ComponentLabel) => {

            if (!map.has(obj.manufacturerName)) {
                map.set(obj.manufacturerName, 0);
            }

            map.set(obj.manufacturerName, map.get(obj.manufacturerName) + 1)

        });

        const sortedMap = new Map([...map.entries()].sort((a, b) => b[1] - a[1]));

        let sum = 0
        sortedMap.forEach((value, key) => {
            console.log(value.toFixed(0));
            (apexChartData as ChartOptions).xaxis.categories.push(key);
            (apexChartData as ChartOptions).series[0].data.push(value.toFixed(0));
            sum += (value * 100 / data.length);
            (apexChartData as ChartOptions).series[1].data.push(sum.toFixed(1) as any);
        });
        console.log(sum)

    }
    apexChartData.values = apexChartData.xaxis?.categories
    return apexChartData
}

export default getManufacturersChartOptionBarMixed1 