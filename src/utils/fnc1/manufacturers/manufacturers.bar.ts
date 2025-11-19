import { AppEnum } from "../../enum/app.enum";
import { ComponentTypes } from "../../types/app";
import { ChartOptions } from "../../types/chart";

const getManufacturersChartOptionBar1 = (data: any, query: Map<string, any>): Partial<ChartOptions> => {
    const sortParam = query.get("sortParam")
    const sortDirection = query.get("sortDirectopn")
    let apexChartData: Partial<ChartOptions> = {
        series: [],
        dataLabels: { enabled: false },
        chart: {
            type: "bar",
            stacked: true,
            zoom: { enabled: true },
            events: {
                mounted: function (chartCtx) {
                    // console.log("sdsdsdsdsdsdsdsd")
                    const clips = chartCtx.el.querySelectorAll("clipPath");
                    clips.forEach((clip: any) => clip.parentNode?.removeChild(clip));
                    const chartEl = chartCtx.el;
                    const toolbarMenu = chartEl.querySelector(".apexcharts-menu");
                    if (!toolbarMenu) return;
                    document.addEventListener("click", (e) => {
                        const target = e.target as HTMLElement;
                        if (
                            !toolbarMenu.contains(target) &&
                            !target.closest(".apexcharts-toolbar")
                        ) {
                            toolbarMenu.classList.remove("apexcharts-menu-open");
                        }
                    });
                },
            }
        },
        xaxis: {
            categories: [],
            tickPlacement: 'on',

            type: 'category',
            labels: {
                rotate: -90,
                trim: false,
                hideOverlappingLabels: true,
                showDuplicates: false,
                rotateAlways: true,
                style: { fontSize: '0px' }
            }
        },
        yaxis: {
            opposite: false,
            title: { text: "" },
            labels: {


                formatter: (val) => val + ' шт'
            }
        },
        tooltip: {
            shared: true,
            intersect: false,
            enabled: true,
            // y: {
            //     formatter: function (val: number, opts: any) {
            //         return `${val} шт`;
            //     }
            // },
            y: {
                formatter: function (val: number, opts: any) {
                    if (val === 0 || val === null || val === undefined) return undefined;

                    return `${val} шт`;
                } as any
            }
        },
        plotOptions: { bar: { horizontal: false } },
        values: []
    };

    const map = new Map<string, Record<string, number>>();
    const componentTypes = query.get("componentTypes") as ComponentTypes[];

    for (const key in data) {
        const ruComponentType = componentTypes!.find(
            c => c.enComponentType.toLowerCase() == key.toLowerCase()
        )!.ruComponentType;

        (apexChartData as ChartOptions).series.push({ name: ruComponentType, data: [] });

        for (const obj of data[key]) {
            if (!map.has(ruComponentType)) map.set(ruComponentType, {});
            if (!map.get(ruComponentType)![obj.manufacturerName])
                map.get(ruComponentType)![obj.manufacturerName] = 0;
            map.get(ruComponentType)![obj.manufacturerName] += 1;
        }
    }

    const globalSumMap = new Map<string, number>();
    for (const [, manufacturerCounts] of map.entries()) {
        for (const manufacturerName in manufacturerCounts) {
            const current = globalSumMap.get(manufacturerName) || 0;
            globalSumMap.set(manufacturerName, current + manufacturerCounts[manufacturerName]);
        }
    }

    const manufacturers = [...globalSumMap.keys()];
    (apexChartData as ChartOptions).xaxis!.categories = manufacturers;

    (apexChartData as ChartOptions).series.forEach((seriesItem: any) => {
        const typeData = map.get(seriesItem.name)!;
        const sum = Object.values(typeData).reduce((acc, val) => acc + val, 0);
        manufacturers.forEach((manufacturerName: string) => {
            const value = typeData[manufacturerName] ?? 0;
            //   seriesItem.data.push(parseFloat(((value * 100) / sum).toFixed(1)));
            seriesItem.data.push(parseFloat((value).toFixed(1)));
        });
    });

    const totalPercents = new Map<string, number>();
    manufacturers.forEach((m, i) => {
        let total = 0;
        (apexChartData as ChartOptions).series.forEach((s: any) => {
            total += s.data[i] || 0;
        });
        totalPercents.set(m, total);
    });

    let sortedManufacturers: string[];

    if (sortParam === AppEnum.PARAMETER) {
        sortedManufacturers = [...manufacturers].sort((a, b) => {
            if (sortDirection === AppEnum.ASC) return a.localeCompare(b, 'ru');
            else return b.localeCompare(a, 'ru');
        });
    } else {
        sortedManufacturers = [...totalPercents.entries()]
            .sort((a, b) =>
                sortDirection === AppEnum.ASC ? a[1] - b[1] : b[1] - a[1]
            )
            .map(([name]) => name);
    }

    (apexChartData as ChartOptions).series.forEach((seriesItem: any) => {
        const newData: number[] = [];
        sortedManufacturers.forEach(m => {
            const index = manufacturers.indexOf(m);
            newData.push(seriesItem.data[index]);
        });
        seriesItem.data = newData;
    });

    (apexChartData as ChartOptions).xaxis!.categories = sortedManufacturers;
    apexChartData.values = sortedManufacturers;

    return apexChartData;
};

export default getManufacturersChartOptionBar1;


// const getManufacturersChartOptionBar1 = (data: any, query: Map<string, any>): Partial<ChartOptions> => {
//     // // console.log(data)
//     let apexChartData: Partial<ChartOptions> = {
//         series: [],
//         dataLabels: {
//             enabled: false
//         },
//         chart: {
//             type: "bar",
//             stacked: true,
//             zoom: {
//                 enabled: true
//             }
//         },
//         xaxis: {
//             categories: [],
//             tickPlacement: 'on',
//             type: 'category',
//             labels: {
//                 style: {
//                     fontSize: '0px',

//                 },
//             }
//         },
//         yaxis: {
//             opposite: false,
//             title: {
//                 text: ""
//             },
//             labels: {
//                 formatter: (val) => {
//                     return val + '%';
//                 },
//                 // style: {
//                 //     fontSize: '0.75vw'
//                 // }
//             }
//         },
//         plotOptions: {
//             bar: {
//                 horizontal: false
//             }
//         },
//         values: []
//     };
//     var map = new Map();
//     var manufacturersMap = new Map()
//     const componentTypes = query.get("componentTypes") as ComponentTypes[]
//     for (const key in data) {
//         const ruComponentType = componentTypes!.find(c => c.enComponentType.toLowerCase() == key.toLowerCase())!.ruComponentType;
//         (apexChartData as ChartOptions).series.push({
//             name: ruComponentType,
//             data: []
//         })
//         for (const obj of data[key]) {
//             let categorieItemIndex: number = (apexChartData.xaxis?.categories as Array<string>).findIndex(
//                 (category: string) => category === obj.manufacturerName
//             )
//             // let seriesItemIndex: number = (apexChartData as ChartOptions).series.findIndex(
//             //     (item: any) => item.name === obj.ruComponentType
//             // )
//             if (categorieItemIndex === -1) {
//                 (apexChartData as ChartOptions).xaxis.categories.push(obj.manufacturerName)
//             }
//             // if (seriesItemIndex === -1 && apexChartData.series) {
//             //     apexChartData.series.push({
//             //         name: obj.ruComponentType,
//             //         data: []
//             //     })
//             // }
//             if (manufacturersMap.get(obj.manufacturerName) === undefined) {
//                 manufacturersMap.set(obj.manufacturerName, 0)
//             }
//             manufacturersMap.set(obj.manufacturerName, manufacturersMap.get(obj.manufacturerName) + 1)

//             if (map.get(ruComponentType) === undefined) {
//                 map.set(ruComponentType, {})
//             }
//             if (map.get(ruComponentType)[obj.manufacturerName] === undefined) {
//                 map.get(ruComponentType)[obj.manufacturerName] = 0
//             }
//             map.get(ruComponentType)[obj.manufacturerName] += 1
//         }
//     }
//     // console.log(map);
//     (apexChartData as ChartOptions).series.forEach((seriesItem: any) => {
//         let sum: number = 0;
//         for (const key in map.get(seriesItem.name)) {
//             sum += map.get(seriesItem.name)[key]
//         }
//         ((apexChartData as ChartOptions).xaxis.categories as Array<string>).forEach((category: string) => {
//             if (seriesItem.name != undefined && seriesItem.data) {
//                 let value: number = map.get(seriesItem.name)[category] === undefined ? 0 : map.get(seriesItem.name)[category]
//                 seriesItem.data.push((value * 100 / sum).toFixed(1))
//             }
//         })
//     })
//     apexChartData.values = apexChartData.xaxis?.categories;
//     // console.log(apexChartData)
//     return apexChartData;
// }


// export default getManufacturersChartOptionBar1