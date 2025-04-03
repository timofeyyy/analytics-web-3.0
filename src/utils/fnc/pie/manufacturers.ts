import { chartOptions } from "../../../assets/fetch.config";
import { AppEnum } from "../../enum/app.enum";
import { ChartData, OptionsApi } from "../../types/app";
import { ChartOptions } from "../../types/chart";
import { BitDepthValue } from "../../types/microchip";



const getManufacturersChartOptionPie = (data: any): ChartData => {
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
        }
    };

    let tmp: any = {}

    if (Array.isArray(data)) {
        data.forEach((obj: BitDepthValue) => {
            let labelsItemIndex: number = (apexChartData as ChartOptions).labels.findIndex(
                (category: string) => category === obj.manufacturerName
            )
            
            if(labelsItemIndex === -1) {
                (apexChartData as ChartOptions).labels.push(obj.manufacturerName)
            }

            if (tmp[obj.manufacturerName] === undefined) {
                tmp[obj.manufacturerName] = 0
            }
     
            tmp[obj.manufacturerName] += 1

        });

        (apexChartData as ChartOptions).labels.forEach((label: string) => {
            (apexChartData as ChartOptions).series.push(tmp[label]);
        })
    }

    return {
        chartOptions: apexChartData,
        values: apexChartData.labels
    };
}

export default getManufacturersChartOptionPie