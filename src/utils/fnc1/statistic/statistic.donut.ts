import { colorTypes } from "../../static-data/chart-options";
import { ComponentTypes } from "../../types/app";
import { ChartOptions } from "../../types/chart";

const getComponentTypesStatChartOptionsDonut = (data: any, query: Map<string, any>): Partial<ChartOptions> => {
    let apexChartData: Partial<ChartOptions> = {
        series: [],
        colors: [],
        chart: {
            type: "donut",
            zoom: {
                enabled: true
            },
            toolbar: { show: false },
            events: {
                mounted: function (chartCtx) {
                    // // console.log("asadsad")
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
        legend: {
            show: false,
            position: 'right',
            horizontalAlign: 'center'
        },
        labels: [],
        values: [],
        responsive: [
            {
                breakpoint: 300,
                options: {
                    legend: {
                        position: "bottom"
                    }
                }
            }
        ],
    };
    const componentTypes = query.get("componentTypes") as ComponentTypes[]
    let tmp: any = {}
    const colorObj: any = {}
    for (const key in data) {
        const RuComponentType = componentTypes!.find(c => c.EnComponentType.toLowerCase() == key.toLowerCase())!.RuComponentType;
        (apexChartData as ChartOptions).labels.push(RuComponentType)

        if (!colorObj[key]) {
            colorObj[key] = colorTypes.find((colorType) => colorType.EnComponentType == key)?.color
        }

        for (const obj of data[key]) {
            if (tmp[RuComponentType] === undefined) {
                tmp[RuComponentType] = 0
            }
            tmp[RuComponentType] += 1
        }
    }
    (apexChartData as ChartOptions).labels.forEach((label: string) => {
        (apexChartData as ChartOptions).series.push(tmp[label]);
    })
    apexChartData.colors = Object.entries(colorObj).map(colorObj => colorObj[1]) as string[];
    apexChartData.values = (apexChartData as ChartOptions).labels
    return apexChartData;
}


export default getComponentTypesStatChartOptionsDonut