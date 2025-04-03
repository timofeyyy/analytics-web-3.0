import { AppEnum, ComponentTypeRuEnum } from "../../enum/app.enum";
import { OptionsApi } from "../../types/app";
import { ChartOptions } from "../../types/chart";
import { BitDepthValue } from "../../types/microchip";



const getComponentKindStatChartOptions = (data: any): Partial<ChartOptions> => {
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
        xaxis: {
            categories: [],
            tickPlacement: 'on'
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
            }
        },
        plotOptions: {
            bar: {
                horizontal: false
            }
        },
    };

    if (Array.isArray(data)) {

        let tmp: any = {}

        data.forEach((obj: OptionsApi) => {
            if (obj.ruComponentType != ComponentTypeRuEnum.RESISTOR) {

                let categorieItemIndex: number = (apexChartData as ChartOptions).xaxis.categories.findIndex(
                    (category: string) => category === obj.ruComponentKind
                )

                if (categorieItemIndex === -1) {
                    console.log(obj.ruComponentKind);
                    (apexChartData as ChartOptions).xaxis.categories.push(obj.ruComponentKind)
                    tmp[obj.ruComponentKind] = {
                        count: 0
                    }

                }

                tmp[obj.ruComponentKind].count += 1
            }
            // if ('bitDepthValue' in obj && obj.bitDepthValue != undefined) {
            //     let categorieItemIndex: number = (apexChartData.categories as Array<string>).findIndex(
            //         (category: string) => category === obj.bitDepthValue
            //     )

            //     if (categorieItemIndex === -1 ) {
            //         apexChartData.categories.push(obj.bitDepthValue)
            //         tmp[obj.bitDepthValue] = {
            //             count: 0
            //         }

            //     }

            //     tmp[obj.bitDepthValue].count += 1
            // }
        });

        (apexChartData as ChartOptions).xaxis.categories.forEach((category: string) => {
            // console.log(category, tmp, tmp[category])
            if ((apexChartData as ChartOptions).series[0].data) {
                (apexChartData as ChartOptions).series[0].data.push(tmp[category].count)
            }
        })
        console.log(tmp, apexChartData)
    }

    return apexChartData;



    // if (Array.isArray(data)) {
    //     data.forEach((obj: OptionsApi) => {
    //         if (obj.ruComponentType != ComponentTypeRuEnum.RESISTOR) {
    //             let categorieItemIndex: number = (apexChartData as ChartOptions).xaxis?.categories.findIndex(
    //                 (item: string) => item === obj.ruComponentKind
    //             )

    //             let seriesItemIndex: number = (apexChartData as ChartOptions).series.findIndex(
    //                 (item: any) => item.name === obj.ruComponentKind
    //             )

    //             if (categorieItemIndex === -1) {
    //                 (apexChartData as ChartOptions).xaxis.categories.push(obj.ruComponentType)
    //             }

    //             if (seriesItemIndex === -1 && apexChartData.series) {
    //                 apexChartData.series.push({
    //                     name: obj.ruComponentKind,
    //                     data: []
    //                 })
    //             }

    //             if (tmp[obj.ruComponentKind] === undefined) {
    //                 tmp[obj.ruComponentKind] = {}
    //             }

    //             if (tmp[obj.ruComponentKind][obj.ruComponentKind] === undefined) {
    //                 tmp[obj.ruComponentKind][obj.ruComponentKind] = 0
    //             }

    //             tmp[obj.ruComponentKind][obj.ruComponentKind] += 1
    //         }
    //     });



    //     (apexChartData as ChartOptions).series.forEach((seriesItem: any) => {
    //         // console.log();
    //         let sum: number = 0;
    //         // (seriesItem.data as Array<number>).forEach((count: number) => {
    //         //     // sum+=count
    //         //     console.log(count);

    //         // });
    //         // console.log(seriesItem.data , seriesItem.data.length);

    //         for (const key in tmp[seriesItem.name]) {
    //             sum += tmp[seriesItem.name][key === null ? "" : key]
    //         }

    //         console.log(sum, seriesItem.name);
    //         (apexChartData as ChartOptions).xaxis.categories.forEach((category: string) => {
    //             if (seriesItem.name != undefined && seriesItem.data) {
    //                 // console.log(category)
    //                 // console.log(tmp[seriesItem.name])
    //                 let value: number = tmp[seriesItem.name][category] === undefined ? 0 : tmp[seriesItem.name][category === null ? "" : category]
    //                 seriesItem.data.push((value * 100 / sum).toFixed(2))
    //             }
    //         })
    //     })
    //     console.log(tmp)
    //     console.log(apexChartData)
    //     // apexChartData.series.forEach((seriesItem: Partial<ISeries>) => {
    //     //     (apexChartData.categories as Array<string>).forEach((catrgory: string) => {
    //     //         if(seriesItem.name != undefined && seriesItem.data) {
    //     //             let value : number = tmp[catrgory][seriesItem.name ] === undefined ? 0 : tmp[catrgory][seriesItem.name]
    //     //             seriesItem.data.push(value)
    //     //         }
    //     //     })
    //     // })
    // }



    // return apexChartData;
}

export default getComponentKindStatChartOptions