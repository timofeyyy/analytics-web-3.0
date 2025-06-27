import { ComponentLabel } from "../../types/app";
import { ChartOptions } from "../../types/chart";
import { BitDepthValue } from "../../types/microchip";



const getManufacturersChartOptionPie1 = (data: any): Partial<ChartOptions> => {
    let apexChartData: Partial<ChartOptions> = {
        series: [],
        chart: {
            type: "pie",
            zoom: {
                enabled: true
            }
        },
        labels: [],
        legend: {
            fontSize: `10vw`
        },
        values: []
    };

    let tmp: any = {}

    // if (Array.isArray(data)) {
    //     data.forEach((obj: ComponentLabel) => {
    for (const key in data) {
        for (const obj of data[key]) {
            let labelsItemIndex: number = (apexChartData as ChartOptions).labels.findIndex(
                (category: string) => category === obj.manufacturerName
            )

            if (labelsItemIndex === -1) {
                (apexChartData as ChartOptions).labels.push(obj.manufacturerName)
            }

            if (tmp[obj.manufacturerName] === undefined) {
                tmp[obj.manufacturerName] = 0
            }

            tmp[obj.manufacturerName] += 1
        }
    }
    // });

    (apexChartData as ChartOptions).labels.forEach((label: string) => {
        (apexChartData as ChartOptions).series.push(tmp[label]);
    })
    // }
    apexChartData.values = apexChartData.labels
    return apexChartData
}

export default getManufacturersChartOptionPie1