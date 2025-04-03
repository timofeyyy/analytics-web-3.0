import { chartOptions } from "../../../assets/fetch.config";
import { AppEnum } from "../../enum/app.enum";
import { ChartData, OptionsApi } from "../../types/app";
import { ChartOptions } from "../../types/chart";
import { BitDepthValue } from "../../types/microchip";



const getBitDepthValueStatDonut = (data: any): Partial<ChartData> => {
    let apexChartData: Partial<ChartOptions> = {
        series: [],
        chart: {
            type: "donut",
            zoom: {
                enabled: true
              }
        },
        labels: [],
    };

    let tmp: any = {}

    if (Array.isArray(data)) {
        data.forEach((obj: BitDepthValue) => {
            let key : string = obj.bitDepthValue === null || obj.bitDepthValue === "" ? "null" : obj.bitDepthValue;

            let labelsItemIndex: number = (apexChartData as ChartOptions).labels.findIndex(
                (category: string) => category === key
            )
            
            if(labelsItemIndex === -1) {
                (apexChartData as ChartOptions).labels.push(key)
            }

            if (tmp[key] === undefined) {
                tmp[key] = 0
            }
        
            tmp[key] += 1

        });
        (apexChartData as ChartOptions).labels.forEach((label: string) => {
            (apexChartData as ChartOptions).series.push(tmp[label]);
        })
    }

    return {
        chartOptions: apexChartData
    };
}

export default getBitDepthValueStatDonut