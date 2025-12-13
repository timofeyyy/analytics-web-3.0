import { AppEnum } from "../../enum/app.enum"
import { ChartOptions } from "../../types/chart"

export const getDateStatisticSidesAll = (data: any, query: Map<string, string>): Partial<ChartOptions> => {
    const EnComponentType = query.get("EnComponentType")!
    const currentDate1 = query.get("currentDate1")!
    const currentDate2 = query.get("currentDate2")!
    const param = query.get("param")!
    const all = query.get("all")!


    let apexChartData: Partial<ChartOptions> = {
        series: [],
        chart: {
            type: "bar",
            // height: 440,
            stacked: true
        },
        colors: ["#008FFB", "#FF4560"],
        plotOptions: {
            bar: {
                horizontal: true,
                barHeight: "80%"
            }
        },
        dataLabels: {
            enabled: false
        },
        // stroke: {
        //     width: 1,
        //     colors: ["#fff"]
        // },

        // grid: {
        //     xaxis: {
        //         lines: {
        //             show: false
        //         }
        //     }
        // },
        yaxis: {
            min: -50,
            max: 50,
            // title: {
                // text: 'Age',
            // }
        },
        tooltip: {
            shared: false,
            x: {
                formatter: function (val: any) {
                    return val.toString();
                }
            },
            y: {
                formatter: function (val: any) {
                    return Math.abs(val) + "";
                }
            }
        },
        xaxis: {
            categories: [],
            title: {
                text: "Количество"
            },
            labels: {
                formatter: function (val: any) {
                    return Math.abs(Math.round(parseInt(val, 10))) + "";
                }
            }
        }
    };


 
    let buffer1: any[] = []
    Object.entries(data[EnComponentType!]).forEach((element: [string, any]) => {
        if(element[0] <= currentDate1) {
            buffer1 = [ ...buffer1, ...element[1]]
        }
    });

    let buffer2: any[] = []
    Object.entries(data[EnComponentType!]).forEach((element: [string, any]) => {
        if(element[0] <= currentDate2) {
            buffer2 = [ ...buffer2, ...element[1]]
        }
    });

    const dataDividedByDates = [
        {
            data: buffer1.sort((a: any, b: any) => {
                const diff = (a[param] ?? 0) - (b[param] ?? 0);
                return -diff;
            }),
            name: currentDate1
        },
        {
            data: buffer2.sort((a: any, b: any) => {
                const diff = (a[param] ?? 0) - (b[param] ?? 0);
                return -diff;
            }),
            name: currentDate2
        }
    ]

    for (let index = 0; index < dataDividedByDates.length; index++) {
        const map = new Map();

        for (const obj of dataDividedByDates[index].data) {
            const value = obj[param] ? `${obj[param]}` : AppEnum.NOTDEFINED;
            if (!obj[param] && all === "0") continue;
            if (!map.has(EnComponentType)) map.set(EnComponentType, {});
            map.get(EnComponentType)[value] = index == 0 ?  (map.get(EnComponentType)[value] || 0) - 1 : (map.get(EnComponentType)[value] || 0) + 1;


            if (!apexChartData.xaxis?.categories?.includes(value))
                apexChartData.xaxis?.categories?.push(value);
        }
        apexChartData.series!.push({
            name: dataDividedByDates[index].name,
            data: apexChartData.xaxis!.categories!.map(
                (category: string) => map.get(EnComponentType)?.[category] || 0
            ),
        });
        console.log(map)
    }
    const sorted = ([...apexChartData.series![0].data, ...apexChartData.series![1].data] as number[]).sort((a: number,b :number) => Math.abs(a) - Math.abs(b));
    console.log(sorted);
    (apexChartData.yaxis as any)!.min = -sorted[sorted.length - 1];
    (apexChartData.yaxis as any)!.max = sorted[sorted.length - 1]
    // console.log(sorted)
    // const sorted = (apexChartData.xaxis?.categories as number[]).sort((a: number,b :number) => Math.abs(a) - Math.abs(b))
    // console.log(sorted[0], sorted[sorted.length - 1])
    console.log(apexChartData)
    return apexChartData
}

