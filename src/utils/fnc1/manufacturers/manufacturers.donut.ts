import { ChartOptions } from "../../types/chart";

const getManufacturersChartOptionDonut1 = (data: any): Partial<ChartOptions> => {
    let apexChartData: Partial<ChartOptions> = {
        series: [],
        chart: {
            type: "donut",
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
        legend: {
            show: true,
            position: 'bottom',
            horizontalAlign: 'center'
        },
        values: []
    };
    var map = new Map();
    for (const key in data) {
        for (const obj of data[key]) {
            let labelsItemIndex: number = (apexChartData as ChartOptions).labels.findIndex(
                (category: string) => category === obj.ManufacturerName
            )

            if (labelsItemIndex === -1) {
                (apexChartData as ChartOptions).labels.push(obj.ManufacturerName)
            }

            if (map.get(obj.ManufacturerName) === undefined) {
                map.set(obj.ManufacturerName, 0)
            }

            map.set(obj.ManufacturerName, map.get(obj.ManufacturerName) + 1)
        }
    }
    (apexChartData as ChartOptions).labels.forEach((label: string) => {
        (apexChartData as ChartOptions).series.push(map.get(label));
    })
    // const sortedMap = new Map([...map.entries()].sort((a, b) => b[1] - a[1]));
    // let res = getMinMax(sortedMap)
    // window.localStorage.setItem('mapWithMaxValues', JSON.stringify(Object.fromEntries(res.max)))
    // window.localStorage.setItem('mapWithMinValues', JSON.stringify(Object.fromEntries(res.min)))
    apexChartData.values = apexChartData.labels
    return apexChartData
}

export default getManufacturersChartOptionDonut1