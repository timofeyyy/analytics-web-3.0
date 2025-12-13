import { ChartOptions } from "../../types/chart";
import getManufacturersChartOptionBarMixed1 from "../manufacturers/manufaturers.mixed";

const getColumnMixedChartOptions = (data: any, query: Map<string, string>): Partial<ChartOptions> => {
    const barXlabels = query.get('bar-x-labels')
    let apexChartData: Partial<ChartOptions> = {
        series: [{
            name: "",
            type: "column",
            data: []
        },
        {
            name: "",
            type: "line",
            data: []
        }],
        legend: {
            show: false
        },
        dataLabels: {
            enabled: false
        },
        chart: {
            type: "line",
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
            tickPlacement: 'on',
            tickAmount: 12,
            type: 'category',
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
        yaxis: [
            {
                opposite: false,
                title: {
                    text: ""
                },
                labels: {
                    formatter: (val: number) => `${val} шт`

                }
            },
            {
                opposite: true,
                title: {
                    text: ""
                },
                labels: {
                    formatter: (val: number) => `${val}%`
                }
            }
        ],
        plotOptions: {
            bar: {
                horizontal: false
            }
        },
        values: []
    };

    const map = new Map();
    let length = 0
    const param = query.get('param')
    const ManufacturerName = query.get('ManufacturerName')
    const EnComponentType = query.get('EnComponentType')
    const all = query.get('all')
    if (param && EnComponentType) {
        length = data[EnComponentType].length
        const sortedData = (data[EnComponentType] as []).sort((a: any, b: any) => a[param] - b[param])
        for (const obj of sortedData as any) {
            if (!obj[param] && all === "0") {
                continue;
            }
            const value = obj[param] ? obj[param] : 'Не указано'
            if (
                ManufacturerName ?
                    (value && obj.ManufacturerName == ManufacturerName) :
                    value
            ) {
                if (!map.has(value)) {
                    map.set(value, 0);
                }
                map.set(value, map.get(value) + 1)
            }
        }

        const sortedMap = new Map([...map.entries()].sort((a, b) => b[1] - a[1]));
        let sum = 0
        sortedMap.forEach((value, key) => {
            (apexChartData as ChartOptions).xaxis.categories.push(key);
            (apexChartData as ChartOptions).series[0].data.push(value.toFixed(0));
            sum += (value * 100 / length);
            (apexChartData as ChartOptions).series[1].data.push(sum.toFixed(1) as any);
        });
    }
    else {
        apexChartData = getManufacturersChartOptionBarMixed1(data)
    }
    apexChartData.values = apexChartData.xaxis?.categories;
    return apexChartData;
}


export default getColumnMixedChartOptions
