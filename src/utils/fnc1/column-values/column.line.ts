import { ChartOptions } from "../../types/chart";
import getManufacturersChartOptionLine1 from "../manufacturers/manufacturers.line";


const getColumnLineChartOptions = (data: any, query: Map<string, string>): Partial<ChartOptions> => {
    const barXlabels = query.get('bar-x-labels')
    const values: any = [];
    const map = new Map();
    const paramAlias = query.get('alias')
    const apexChartData: Partial<ChartOptions> = {
        series: [],
        dataLabels: {
            enabled: false
        },
        chart: {
            type: "area",
            stacked: true,
            zoom: {
                enabled: true
            },
              events: {
                mounted: function (chartCtx) {
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
            tickAmount: 10,
            labels: {
                rotate: -90,
                trim: false,
                hideOverlappingLabels: true,
                showDuplicates: false,
                rotateAlways: true,
                formatter: (val: string) => {
                    return `${val}`
                    if (!val) return '';
                    return val.length > 10 ? val.substring(0, 10) + '…' : val;
                },

                style: {
                    fontSize: barXlabels === "1" ? 'max(.8vw, 8px)' : '0px',
                },
            }
        },
        tooltip: {
            shared: true,
            custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                // const val = series[seriesIndex][dataPointIndex];
                // const index = opts.dataPointIndex;
                // const xVal = w.globals.labels[dataPointIndex];
                const param = paramAlias;
                const value = values[dataPointIndex];

                return `
                <div style="box-sizing:border-box;padding:.5vw;">
                    <p style="font-size:.8vw;">Параметр: ${param}</p>
                    <p style="font-size:.8vw;">Значение: ${value}</p>
                    <p style="font-size:.8vw;">Количество: ${apexChartData.series![0].data[dataPointIndex]} шт</p>
                    <p style="font-size:.8vw;">Дата: ${apexChartData!.values![dataPointIndex]}</p>
                </div>
                `;
            }
            // x: {
            //     formatter: function (val: number, opts: any) {
            //         const index = opts.dataPointIndex;
            //         return ` Параметр: ${paramAlias}\n Значение: ${values[index]}\n Дата: ${apexChartData!.values![index]};`;
            //     },
            // },
            //  style: {
            //     fontSize: barXlabels === "1" ? 'max(.8vw, 8px)' : '0px',
            //     whiteSpace: 'pre-line',
            // },
        },
        yaxis: {
            opposite: false,
            title: {
                text: ""
            },
            labels: {
                style: {
                    fontSize: '0.75vw'
                }
            }
        },
        values: []
    };
    const param = query.get('param')
    const ManufacturerName = query.get('ManufacturerName')
    const EnComponentType = query.get('EnComponentType')
    const all = query.get('all')

    if (param && EnComponentType) {
        apexChartData.series = [{
            name: "Количество",
            data: []
        }]
        const sortedData = (data[EnComponentType] as []).sort((a: any, b: any) => a[param] - b[param])
        for (const obj of sortedData as any) {
            if (ManufacturerName ? (obj[param] && obj.ManufacturerName == ManufacturerName) : obj[param] && obj[param]) {
                if (!obj[param] && all === "0") {
                    continue;
                }
                const date = new Date(obj.date)
                const dateStr = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
                let categorieItemIndex: number = (apexChartData.xaxis?.categories as Array<string>).findIndex(
                    (category: string) => category == dateStr
                )


                if (categorieItemIndex === -1) {
                    (apexChartData as ChartOptions).xaxis.categories.push(dateStr)
                }

                if (map.get(dateStr) === undefined) {
                    map.set(dateStr, {})
                }
                if (map.get(dateStr)[`${obj[param]}`] === undefined) {
                    map.get(dateStr)[`${obj[param]}`] = 0
                }
                map.get(dateStr)[`${obj[param]}`] += 1
            }
        }
        const categories = ((apexChartData as ChartOptions).xaxis.categories as Array<string>)
        const series = apexChartData.series![0]
        for (const category of categories) {
            const dateObj = map.get(category)
            const entries = Object.entries(dateObj).sort((a: any, b: any) => b[1] - a[1])
            if (!entries.length) {
                continue
            }
            const first = entries[0]
            // // // console.log(first)
            // for (const element of entries) {
            //     if (element == firstValue) {

            //     }
            // }
            series.data.push((first as any)[1])
            values.push((first as any)[0])
        }
        apexChartData.values = apexChartData.xaxis?.categories;
        // .forEach((category: string) => {


        // const series = apexChartData.series![0]
        // if (series.name != undefined && series.data) {
        //     let value: number = map.get(series.name)[category] === undefined ? 0 : map.get(series.name)[category]
        //     series.data.push(value)
        // }
        // })

    }
    // else {
    //     apexChartData = getManufacturersChartOptionLine1(data)
    // }
    return apexChartData
}

export default getColumnLineChartOptions

