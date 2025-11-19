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
            labels: {
                formatter: (val) => {
                    return `${val}`;
                },
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
    var map = new Map();
    let length = 0
    for (const key in data) {
        length += data[key].length
        for (const obj of data[key]) {
            if (!map.has(obj.manufacturerName)) {
                map.set(obj.manufacturerName, 0);
            }
            map.set(obj.manufacturerName, map.get(obj.manufacturerName) + 1)
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
    apexChartData.values = apexChartData.xaxis?.categories
    return apexChartData
}
export default getManufacturersChartOptionBarMixed1 