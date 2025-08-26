import { ChartOptions } from "../../types/chart";
import { BitDepthValue } from "../../types/microchip";

const getBitDepthValueStatBar = (data: any): Partial<ChartOptions> => {
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
        },
    };

    if (Array.isArray(data)) {
        var map = new Map();
        data.forEach((obj: BitDepthValue) => {
            if (obj.bitDepthValue != undefined) {
                let bitDepthValue: string = obj.bitDepthValue === "" ? "null" : obj.bitDepthValue
                let categorieItemIndex: number = apexChartData.xaxis?.categories.findIndex(
                    (category: string) => category === bitDepthValue
                )

                if (categorieItemIndex === -1) {
                    apexChartData.xaxis?.categories.push(bitDepthValue)
                    map.set(bitDepthValue, 0)
                }
                map.set(bitDepthValue, map.get(bitDepthValue) + 1)
            }
        });
        const sortedMap = new Map([...map.entries()].sort((a, b) => b[1] - a[1]));
        let series: Array<any> = [{
            name: "",
            data: []
        }]
        apexChartData.xaxis?.categories.forEach((category: any) => {
            series[0].data.push(map.get(category))
        })
      
        apexChartData.series = series
        // apexChartData.mapWithMaxValues = resMap
    }
    apexChartData.values = apexChartData.xaxis?.categories
    apexChartData.propName = "bitDepthValue"
    return apexChartData
}



export default getBitDepthValueStatBar
