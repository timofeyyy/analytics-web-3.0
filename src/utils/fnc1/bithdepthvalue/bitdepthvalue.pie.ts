import { ChartOptions } from "../../types/chart";
import { BitDepthValue } from "../../types/microchip";
import getManufacturer from "../other/get_manufacturer";
import getMinMax from "../other/getMinMaxFromMap";



const getBitDepthValueStatPie = (data: any): Partial<ChartOptions> => {
    let manufacturerName = getManufacturer(data)
    let apexChartData: Partial<ChartOptions> = {
        series: [],
        chart: {
            type: "pie",
            zoom: {
                enabled: true
            }
        },
        labels: [],
        chartName: `Количественный график битности по ${manufacturerName ? 'производителю ' + manufacturerName : 'по всем производителям'}`

    };

    var map = new Map();

    if (Array.isArray(data)) {
        data.forEach((obj: BitDepthValue) => {
            let key: string = obj.bitDepthValue === null || obj.bitDepthValue === "" ? "null" : obj.bitDepthValue;
            let labelsItemIndex: number = (apexChartData as ChartOptions).labels.findIndex(
                (category: string) => category === key
            )
            if (labelsItemIndex === -1) {
                (apexChartData as ChartOptions).labels.push(key)
            }
            if (map.get(key) === undefined) {
                map.set(key, 0)
            }
            map.set(key, map.get(key) + 1)
        });
        const sortedMap = new Map([...map.entries()].sort((a, b) => b[1] - a[1]));
        (apexChartData as ChartOptions).labels.forEach((label: string) => {
            (apexChartData as ChartOptions).series.push(map.get(label));
        })
        let res = getMinMax(sortedMap)
        window.localStorage.setItem('mapWithMaxValues', JSON.stringify(Object.fromEntries(res.max)))
        window.localStorage.setItem('mapWithMinValues', JSON.stringify(Object.fromEntries(res.min)))
    }
    apexChartData.values = apexChartData.labels
    apexChartData.propName = "bitDepthValue"
    return apexChartData
}

export default getBitDepthValueStatPie