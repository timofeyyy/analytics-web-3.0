import { ComponentLabel } from "../../types/app";
import { ChartOptions } from "../../types/chart";

const getComponentTypesStatChartOptionsDonut = (data: any): Partial<ChartOptions> => {
    let apexChartData: Partial<ChartOptions> = {
        series: [],
        chart: {
            type: "donut",
            zoom: {
                enabled: true
              }
        },
        labels: []
    };

    let tmp: any = {}

    if (Array.isArray(data)) {
        data.forEach((obj: ComponentLabel) => {
            let labelsItemIndex: number = (apexChartData as ChartOptions).labels.findIndex(
                (category: string) => category === obj.ruComponentType
            )
            if(labelsItemIndex === -1) {
                (apexChartData as ChartOptions).labels.push(obj.ruComponentType)
            }
            if (tmp[obj.ruComponentType] === undefined) {
                tmp[obj.ruComponentType] = 0
            }
            tmp[obj.ruComponentType] += 1
        });

        (apexChartData as ChartOptions).labels.forEach((label: string) => {
            (apexChartData as ChartOptions).series.push(tmp[label]);
        })
    }
    
    // console.log(tmp)

    return apexChartData;
}

export default getComponentTypesStatChartOptionsDonut