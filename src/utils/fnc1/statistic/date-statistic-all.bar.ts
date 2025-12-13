import { AppEnum } from "../../enum/app.enum"
import { ChartOptions } from "../../types/chart"

export const getDateStatisticBarAll = (data: any, query: Map<string, string>): Partial<ChartOptions> => {
     
    const EnComponentType = query.get("EnComponentType")!
    const currentDate1 = query.get("currentDate1")!
    const currentDate2 = query.get("currentDate2")!
    const param = query.get("param")!
    const all = query.get("all")!

    let apexChartData: Partial<ChartOptions> = {
        series: [],
        dataLabels: { enabled: false },
        chart: {
            type: "bar",
            stacked: false,
            zoom: { enabled: true },
            toolbar: { show: true },
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
        colors: ["#008FFB", "#FF4560"],
        xaxis: {
            tickAmount: 20,
            categories: [],
            tickPlacement: "on",
            type: "category",
            labels: {
                rotate: -90,
                trim: false,
                hideOverlappingLabels: true,
                showDuplicates: false,
                rotateAlways: true,
                formatter: (val: string) => `${val}`,
                // style: { fontSize: xLabelSize ?? "0px" },
            },
            title: {
                text: "Количество"
            },
        },
        tooltip: {
            shared: true,
            intersect: false,
            enabled: true,
            y: {
                formatter: ((val: number) => {
                    if (!val) return undefined;
                    return `${val} шт`;
                }) as any,
            },
        },
        yaxis: {
            opposite: false,
            title: { text: "" },
            // labels: {
            //     style: { fontSize: yLabelSize ?? "0px" },
            // },
        },
        plotOptions: { bar: { horizontal: false } },
        values: [],
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
            map.get(EnComponentType)[value] = (map.get(EnComponentType)[value] || 0) + 1;


            if (!apexChartData.xaxis?.categories?.includes(value))
                apexChartData.xaxis?.categories?.push(value);
        }
        apexChartData.series!.push({
            name: dataDividedByDates[index].name,
            data: apexChartData.xaxis!.categories!.map(
                (category: string) => map.get(EnComponentType)?.[category] || 0
            ),
        });
    }

    return apexChartData;
}

