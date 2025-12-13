import { AppEnum } from "../../enum/app.enum";
import { ChartOptions } from "../../types/chart";

export const getSelectionLadder = (data: any, query: Map<string, string>): Partial<ChartOptions> => {
    // const yLabelSize = query.get('y-labels-size');
    // const xLabelSize = query.get('x-labels-size');
    console.log(data)
    let apexChartData: Partial<ChartOptions> = {
        series: [
            {
                name: "Количество",
                data: data
            }
        ],
        chart: {
            type: "bar"
        },
        plotOptions: {
            bar: {
                horizontal: true
            }
        },
        dataLabels: {
            enabled: false
        },
        tooltip: {
            x: {
                show: true,
                formatter: () => 'Выбранные компоненты'
            }
        },
        xaxis: {
            categories: (data as number[]).map((element, index) => {
              return `Приоритет ${index + 1}`
            })
        },

    };

    // const map = new Map();
    //   const param = query.get("param");
    //   const ManufacturerName = query.get("ManufacturerName");
    //   const EnComponentType = query.get("EnComponentType");
    //   const all = query.get("all");

    // const data1: any = [100, 50, 25]
    // for (const element of data1) {
    //     apexChartData.xaxis?.categories?.push(element);
    //     apexChartData.series!.push({
    //         name: 'EnComponentType',
    //         data: [1,2,3,4]
    //     });
    // }



    // if (param && EnComponentType) {
    //     let sortedData = [...(data[EnComponentType] as any[])];
    //     if (sortParam === AppEnum.PARAMETER) {
    //         sortedData.sort((a, b) => {
    //             const diff = (a[param] ?? 0) - (b[param] ?? 0);
    //             return sortDirection === AppEnum.ASC ? diff : -diff;
    //         });
    //     }

    //     for (const obj of sortedData) {
    //         const value = obj[param] ? `${obj[param]}` : AppEnum.NOTDEFINED;
    //         if (!obj[param] && all === "0") continue;

    //         if (
    //             ManufacturerName
    //                 ? value && (obj.ManufacturerName === ManufacturerName || ManufacturerName === AppEnum.ALL)
    //                 : value
    //         ) {
    //             if (!map.has(EnComponentType)) map.set(EnComponentType, {});
    //             map.get(EnComponentType)[value] = (map.get(EnComponentType)[value] || 0) + 1;

    //             if (!apexChartData.xaxis?.categories?.includes(value))
    //                 apexChartData.xaxis?.categories?.push(value);
    //         }
    //     }

    //     apexChartData.series!.push({
    //         name: EnComponentType,
    //         data: apexChartData.xaxis!.categories!.map(
    //             (category: string) => map.get(EnComponentType)?.[category] || 0
    //         ),
    //     });

    //     if (sortParam === AppEnum.AMOUNT) {
    //         const combined = apexChartData.xaxis!.categories!.map((cat: any, idx: any) => ({
    //             category: cat,
    //             value: apexChartData.series![0].data[idx],
    //         }));

    //         combined.sort((a: any, b: any) => {
    //             const diff = a.value - b.value;
    //             return sortDirection === AppEnum.ASC ? diff : -diff;
    //         });

    //         apexChartData.xaxis!.categories = combined.map((c: any) => c.category);
    //         apexChartData.series![0].data = combined.map((c: any) => c.value);
    //     }

    //     apexChartData.values = apexChartData.xaxis?.categories;
    // }

    return apexChartData;
};
