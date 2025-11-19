import { AppEnum } from "../../enum/app.enum";
import { componentStorage } from "../../redux/component";
import { ChartOptions } from "../../types/chart";
import getManufacturersChartOptionBar1 from "../manufacturers/manufacturers.bar";

// const getColumnBarChartOptions = (data: any, query: Map<string, string>): Partial<ChartOptions> => {
//   const yLabelSize = query.get('y-labels-size')
//   const xLabelSize = query.get('x-labels-size')
//   const sortParam = query.get("sortParam")
//   const sortDirection = query.get("sortDirectopn")
//   // console.log(query)
//   let apexChartData: Partial<ChartOptions> = {
//     series: [],
//     dataLabels: {
//       enabled: false
//     },
//     chart: {
//       type: "bar",
//       stacked: true,
//       zoom: {
//         enabled: true
//       }
//     },
//     xaxis: {
//       tickAmount: 20,
//       categories: [],
//       tickPlacement: 'on',
//       type: 'category',
//       labels: {
//         rotate: -90,
//         trim: false,
//         hideOverlappingLabels: true,
//         showDuplicates: false,
//         rotateAlways: true,

//         formatter: (val: string) => {
//           return `${val}`
//           if (!val) return '';
//           return val.length > 0 ? val.substring(0, 10) + '…' : val;
//         },

//         style: {
//           fontSize: xLabelSize ?? '0px'
//         },
//       }
//     },
//     tooltip: {
//       shared: true,
//       intersect: false,
//       enabled: true,
//       y: {
//         formatter: function (val: number, opts: any) {
//           return `${val} шт`;
//         }
//       },
//     },
//     yaxis: {
//       opposite: false,
//       title: {
//         text: ""
//       },
//       labels: {
//         style: {
//           fontSize: yLabelSize ?? '0px'
//         }
//       }
//     },
//     plotOptions: {
//       bar: {
//         horizontal: false
//       }
//     },
//     values: []
//   };
//   const map = new Map();
//   const param = query.get('param')
//   const manufacturerName = query.get('manufacturerName')
//   const enComponentType = query.get('enComponentType')
//   const all = query.get('all')
//   // // console.log(enComponentType)
//   if (param && enComponentType) {
//     const sortedData = (data[enComponentType.toLowerCase()] as []).sort((a: any, b: any) => a[param] - b[param])
//     for (const obj of sortedData as any) {
//       const value = obj[param] ? `${obj[param]}` : 'Не указано'
//       if (!obj[param] && all === "0") {
//         continue;
//       }
//       if (
//         manufacturerName ?
//           (value && obj.manufacturerName == manufacturerName || manufacturerName == AppEnum.ALL) :
//           value
//       ) {
//         let categorieItemIndex: number = (apexChartData.xaxis?.categories as Array<string>).findIndex(
//           (category: string) => category === value
//         )
//         let seriesItemIndex: number = (apexChartData as ChartOptions).series.findIndex(
//           (item: any) => item.name.toLowerCase() === enComponentType.toLowerCase()
//         )

//         if (categorieItemIndex === -1) {
//           (apexChartData as ChartOptions).xaxis.categories.push(value)
//         }
//         if (seriesItemIndex === -1 && apexChartData.series) {
//           apexChartData.series.push({
//             name: enComponentType,
//             data: []
//           })
//         }
//         if (map.get(enComponentType) === undefined) {
//           map.set(enComponentType, {})
//         }
//         if (map.get(enComponentType)[value] === undefined) {
//           map.get(enComponentType)[value] = 0
//         }
//         map.get(enComponentType)[value] += 1
//       }
//     }
//     (apexChartData as ChartOptions).series.forEach((seriesItem: any) => {
//       ((apexChartData as ChartOptions).xaxis.categories as Array<string>).forEach((category: string) => {
//         if (seriesItem.name != undefined && seriesItem.data) {
//           let value: number = map.get(seriesItem.name)[category] === undefined ? 0 : map.get(seriesItem.name)[category]
//           seriesItem.data.push(value)
//         }
//       })
//     })
//     apexChartData.values = apexChartData.xaxis?.categories;
//   }

//   return apexChartData;
// }

const getColumnBarChartOptions = (data: any, query: Map<string, string>): Partial<ChartOptions> => {
  const yLabelSize = query.get('y-labels-size');
  const xLabelSize = query.get('x-labels-size');
  const sortParam = query.get("sortParam");
  const sortDirection = query.get("sortDirectopn");

  let apexChartData: Partial<ChartOptions> = {
    series: [],
    dataLabels: { enabled: false },
    chart: {
      type: "bar",
      stacked: true,
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
        style: { fontSize: xLabelSize ?? "0px" },
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
      labels: {
        style: { fontSize: yLabelSize ?? "0px" },
      },
    },
    plotOptions: { bar: { horizontal: false } },
    values: [],
  };

  const map = new Map();
  const param = query.get("param");
  const manufacturerName = query.get("manufacturerName");
  const enComponentType = query.get("enComponentType");
  const all = query.get("all");

  if (param && enComponentType) {
    let sortedData = [...(data[enComponentType.toLowerCase()] as any[])];
    if (sortParam === "param") {
      sortedData.sort((a, b) => {
        const diff = (a[param] ?? 0) - (b[param] ?? 0);
        return sortDirection === AppEnum.ASC ? diff : -diff;
      });
    }

    for (const obj of sortedData) {
      const value = obj[param] ? `${obj[param]}` : AppEnum.NOTDEFINED;
      if (!obj[param] && all === "0") continue;

      if (
        manufacturerName
          ? value && (obj.manufacturerName === manufacturerName || manufacturerName === AppEnum.ALL)
          : value
      ) {
        if (!map.has(enComponentType)) map.set(enComponentType, {});
        map.get(enComponentType)[value] = (map.get(enComponentType)[value] || 0) + 1;

        if (!apexChartData.xaxis?.categories?.includes(value))
          apexChartData.xaxis?.categories?.push(value);
      }
    }

    apexChartData.series!.push({
      name: enComponentType,
      data: apexChartData.xaxis!.categories!.map(
        (category: string) => map.get(enComponentType)?.[category] || 0
      ),
    });

    if (sortParam === AppEnum.AMOUNT) {
      const combined = apexChartData.xaxis!.categories!.map((cat: any, idx: any) => ({
        category: cat,
        value: apexChartData.series![0].data[idx],
      }));

      combined.sort((a: any, b: any) => {
        const diff = a.value - b.value;
        return sortDirection === AppEnum.ASC ? diff : -diff;
      });

      apexChartData.xaxis!.categories = combined.map((c: any) => c.category);
      apexChartData.series![0].data = combined.map((c: any) => c.value);
    }

    apexChartData.values = apexChartData.xaxis?.categories;
  }

  return apexChartData;
};


export default getColumnBarChartOptions