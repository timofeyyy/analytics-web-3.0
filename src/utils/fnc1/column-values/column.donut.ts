import { AppEnum } from "../../enum/app.enum";
import { ChartOptions } from "../../types/chart";
import getManufacturersChartOptionDonut1 from "../manufacturers/manufacturers.donut";



// const getColumnDonutChartOptions = (data: any, query: Map<string, string>): Partial<ChartOptions> => {
//     let apexChartData: Partial<ChartOptions> = {
//         series: [],
//         chart: {
//             type: "donut",
//             zoom: {
//                 enabled: true
//             }
//         },
//         labels: [],
//         tooltip: {
//             enabled: true,
//             y: {
//                 formatter: function (val: number, opts: any) {
//                     return `${val} шт`;
//                 }
//             },
//         },
//         legend: {
//             show: false,
//             position: 'bottom',
//             horizontalAlign: 'center',
//             formatter: (val: string) => {
//                 return `${val} шт`
//             },
//         },
//         values: []
//     };

//     const map = new Map()
//     const param = query.get('param')
//     const ManufacturerName = query.get('ManufacturerName')
//     const EnComponentType = query.get('EnComponentType')
//     const all = query.get('all')
//     if (param && EnComponentType) {
//         const sortedData = (data[EnComponentType] as []).sort((a: any, b: any) => a[param] - b[param])
//         for (const obj of sortedData as any) {
//             const value = obj[param] ? `${obj[param]}` : 'Не указано'
//             if (!obj[param] && all === "0") {
//                 continue;
//             }
//             if (
//                 ManufacturerName ?
//                     (value && obj.ManufacturerName == ManufacturerName) :
//                     value
//             ) {

//                 let labelsItemIndex: number = (apexChartData as ChartOptions).labels.findIndex(
//                     (category: string) => category === value
//                 )
//                 if (labelsItemIndex === -1) {
//                     (apexChartData as ChartOptions).labels.push(value)
//                 }
//                 if (map.get(value) === undefined) {
//                     map.set(value, 0)
//                 }
//                 map.set(value, map.get(value) + 1)
//             }
//         }
//         (apexChartData as ChartOptions).labels.forEach((label: string) => {
//             (apexChartData as ChartOptions).series.push(map.get(label));
//         })

//         apexChartData.values = apexChartData.labels
//     }
//     else {
//         apexChartData = getManufacturersChartOptionDonut1(data)
//     }
//     return apexChartData
// }

const getColumnDonutChartOptions = (data: any, query: Map<string, string>): Partial<ChartOptions> => {
  const sortParam = query.get("sortParam");
  const sortDirection = query.get("sortDirectopn");

  let apexChartData: Partial<ChartOptions> = {
    series: [],
    chart: {
      type: "donut",
      zoom: {
        enabled: true,
      },
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
    labels: [],
    tooltip: {
      enabled: true,
      y: {
        formatter: function (val: number) {
          return `${val} шт`;
        },
      },
    },
    legend: {
      show: false,
      position: "bottom",
      horizontalAlign: "center",
      formatter: (val: string) => {
        return `${val} шт`;
      },
    },
    values: [],
  };

  const map = new Map();
  const param = query.get("param");
  const ManufacturerName = query.get("ManufacturerName");
  const EnComponentType = query.get("EnComponentType");
  const all = query.get("all");

  if (param && EnComponentType) {
    let sortedData = [...(data[EnComponentType] as any[])];

    if (sortParam === "param") {
      sortedData.sort((a, b) => {
        const diff = (a[param] ?? 0) - (b[param] ?? 0);
        return sortDirection === AppEnum.ASC ? diff : -diff;
      });
    }

    for (const obj of sortedData as any) {
      const value = obj[param] ? `${obj[param]}` : "Не указано";
      if (!obj[param] && all === "0") continue;

      if (
        ManufacturerName
          ? value && (obj.ManufacturerName === ManufacturerName || ManufacturerName === AppEnum.ALL)
          : value
      ) {
        if (!apexChartData.labels!.includes(value)) {
          (apexChartData as ChartOptions).labels.push(value);
        }

        if (map.get(value) === undefined) {
          map.set(value, 0);
        }
        map.set(value, map.get(value) + 1);
      }
    }

    (apexChartData as ChartOptions).labels.forEach((label: string) => {
      (apexChartData as ChartOptions).series.push(map.get(label));
    });

    if (sortParam === AppEnum.AMOUNT) {
      const combined = (apexChartData as ChartOptions).labels.map((label: string, idx: number) => ({
        label,
        value: (apexChartData as ChartOptions).series[idx],
      }));

      combined.sort((a: any, b: any) => {
        const diff = a.value - b.value;
        return sortDirection === AppEnum.ASC ? diff : -diff;
      });

      (apexChartData as ChartOptions).labels = combined.map((c: any) => c.label);
      (apexChartData as ChartOptions).series = combined.map((c: any) => c.value);
    }

    apexChartData.values = apexChartData.labels;
  } else {
    apexChartData = getManufacturersChartOptionDonut1(data);
  }

  return apexChartData;
};

export default getColumnDonutChartOptions