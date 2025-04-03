
// const getBitDepthValueMixed = (data: any): IApiConfig => {
//     let apexChartData: IApexChartData = {
//         categories: [],
//         series: [
//             {
//                 name: "количество",
//                 type: "column",
//                 data: []
//             },
//             {
//                 name: "проценты",
//                 type: "line",
//                 data: []
//             }
//         ],
//         yLabel: "битность",
//         xLabel: "битность",
//         chart: {
//             type: "line"
//         },
//         yaxis: [
//             {
//                 opposite: false,
//                 title: {
//                     text: ""
//                 }
//             }
//             , {
//                 opposite: true,
//                 title: {
//                     text: ""
//                 }
//             }],
//         horizontal: false
//     };

//     let map = new Map();

//     if (Array.isArray(data)) {

//         let tmp: any = {}

//         // if (data.length && 'bitDepthValue' in data[0]) {
//         // map.set('bitDepthValue', [])
//         // }

//         data.forEach((obj: BitDepthValue) => {
//             if ('bitDepthValue' in obj && obj.bitDepthValue != undefined) {
//                 let categorieItemIndex: number = (apexChartData.categories as Array<string>).findIndex(
//                     (category: string) => category === obj.bitDepthValue
//                 )

//                 if (categorieItemIndex === -1) {
//                     apexChartData.categories.push(obj.bitDepthValue)
//                     tmp[obj.bitDepthValue] = {
//                         count: 0
//                     }
//                     // map.get('bitDepthValue').push(obj.bitDepthValue)

//                 }

//                 tmp[obj.bitDepthValue].count += 1
//             }
//         });

//         (apexChartData.categories as Array<string>).forEach((category: string) => {
//             if (apexChartData.series[0].data && apexChartData.series[1].data) {
//                 apexChartData.series[0].data.push(tmp[category].count)
//                 apexChartData.series[1].data.push(tmp[category].count * 100 / 200)
//             }

//         })
//     }

//     return {
//         apexChartData: apexChartData,
//         sortColumns: map
//     };
// }




import { AppEnum } from "../../enum/app.enum";
import { ChartData, OptionsApi } from "../../types/app";
import { ChartOptions } from "../../types/chart";
import { BitDepthValue } from "../../types/microchip";



const getManufacturersChartOptionBarMixed = (data: any): ChartData => {
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
        }
    };
    var map = new Map();

    if (Array.isArray(data)) {
        data.forEach((obj: OptionsApi) => {

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

    return {
        chartOptions: apexChartData,
        values: apexChartData.xaxis?.categories
    };
}

export default getManufacturersChartOptionBarMixed