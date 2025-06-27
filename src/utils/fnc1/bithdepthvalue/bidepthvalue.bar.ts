import { ChartOptions } from "../../types/chart";
import { BitDepthValue } from "../../types/microchip";

const getBitDepthValueStatBar = (data: any): Partial<ChartOptions> => {
    console.log(data)
    let apexChartData: Partial<ChartOptions> = {
        series: [],
        dataLabels: {
            enabled: false
          },
        chart: {
            type: "bar",
            stacked: true,
            zoom: {
                enabled: true
            }
        },
        xaxis: {
            categories: [],
            tickPlacement: 'on'
        },
        yaxis: {
            opposite: false,
            title: {
                text: "Количество"
            }
        },
        plotOptions: {
            bar: {
                horizontal: false
            }
        }
    };
    if (Array.isArray(data)) {
        let tmp: any = {}
        data.forEach((obj: BitDepthValue) => {
            if (obj.bitDepthValue != undefined) {
                let bitDepthValue: string =  obj.bitDepthValue === "" ? "null" : obj.bitDepthValue
                let categorieItemIndex: number = apexChartData.xaxis?.categories.findIndex(
                    (category: string) => category === bitDepthValue
                )

                if (categorieItemIndex === -1) {
                    apexChartData.xaxis?.categories.push(bitDepthValue)
                    tmp[bitDepthValue] = 0
                }

                tmp[bitDepthValue] += 1
            }
        });


        let series: Array<any> = [{
            name: "",
            data: []
        }]
        apexChartData.xaxis?.categories.forEach((category: any) => {
            series[0].data.push(tmp[category])
        })
        apexChartData.series = series
    }
    apexChartData.values = apexChartData.xaxis?.categories
    apexChartData.propName = "bitDepthValue"
    return apexChartData
}

export default getBitDepthValueStatBar
