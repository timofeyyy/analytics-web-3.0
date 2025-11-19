import { ChartOptions } from "../../types/chart";
import getManufacturersChartOptionPie1 from "../manufacturers/manufacturers.pie";



const getColumnPieChartOptions = (data: any, query: Map<string, string>): Partial<ChartOptions> => {
    let apexChartData: Partial<ChartOptions> = {
        series: [],
        chart: {
            type: "pie",
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
        labels: [],
        tooltip: {
            enabled: true,
            y: {
                formatter: function (val: number, opts: any) {
                    return `${val} шт`;
                }
            },
        },
        legend: {
            show: false,
            position: 'bottom',
            horizontalAlign: 'center',

        },
        values: []
    };

    const map = new Map()
    const param = query.get('param')
    const manufacturerName = query.get('manufacturerName')
    const enComponentType = query.get('enComponentType')
    const all = query.get('all')
    if (param && enComponentType) {
        const sortedData = (data[enComponentType.toLowerCase()] as []).sort((a: any, b: any) => a[param] - b[param])
        for (const obj of sortedData as any) {
            const value = obj[param] ? `${obj[param]}` : 'Не указано'
            if (!obj[param] && all === "0") {
                continue;
            }

            if (
                manufacturerName ?
                    (value && obj.manufacturerName == manufacturerName) :
                    value
            ) {

                let labelsItemIndex: number = (apexChartData as ChartOptions).labels.findIndex(
                    (category: string) => category === value
                )
                if (labelsItemIndex === -1) {
                    (apexChartData as ChartOptions).labels.push(value)
                }
                if (map.get(value) === undefined) {
                    map.set(value, 0)
                }
                map.set(value, map.get(value) + 1)
            }
        }

        (apexChartData as ChartOptions).labels.forEach((label: string) => {
            (apexChartData as ChartOptions).series.push(map.get(label));
        })

        apexChartData.values = apexChartData.labels
    }
    else {
        apexChartData = getManufacturersChartOptionPie1(data)
    }
    return apexChartData
}

export default getColumnPieChartOptions