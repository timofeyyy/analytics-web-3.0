import { ChartOptions } from "../../types/chart";
import { BitDepthValue } from "../../types/microchip";
import getManufacturer from "../other/get_manufacturer";
import getMinMax from "../other/getMinMaxFromMap";

const getBitDepthValueStatMixed = (data: any): Partial<ChartOptions> => {
    let apexChartData: Partial<ChartOptions> = {
        series: [{
            name: "количество",
            type: "column",
            data: []
        },
        {
            name: "проценты",
            type: "line",
            data: []
        }],
        dataLabels: {
            enabled: false
        },
        chart: {
            type: "line",
            zoom: {
                enabled: true
            }
        },
        xaxis: {
            categories: [],
            tickPlacement: 'on',
            labels: {
                style: {
                    fontSize: '0px',

                },
            }
        },
        yaxis: [{
            opposite: false,
            title: {
                text: ""
            }
        }
            , {
            opposite: true,
            title: {
                text: ""
            },
            labels: {
                formatter: (val) => {
                    return val + '%';
                }
            }
        }],
        plotOptions: {
            bar: {
                horizontal: false
            }
        }
    };

    if (Array.isArray(data)) {

        var map = new Map();

        data.forEach((obj: BitDepthValue) => {
            let bitDepthValue: string = obj.bitDepthValue === null || obj.bitDepthValue === "" ? "null" : obj.bitDepthValue;
            if (!map.has(bitDepthValue)) {
                map.set(bitDepthValue, 0);
            }
            map.set(bitDepthValue, map.get(bitDepthValue) + 1)
        });

        const sortedMap = new Map([...map.entries()].sort((a, b) => b[1] - a[1]));
        let sum = 0
        sortedMap.forEach((value, key) => {
            (apexChartData as ChartOptions).xaxis.categories.push(key);
            (apexChartData as ChartOptions).series[0].data.push(value.toFixed(0));
            sum += (value * 100 / data.length);
            (apexChartData as ChartOptions).series[1].data.push(sum.toFixed(1) as any);
        });
        let res = getMinMax(sortedMap)
        window.localStorage.setItem('mapWithMaxValues', JSON.stringify(Object.fromEntries(res.max)))
        window.localStorage.setItem('mapWithMinValues', JSON.stringify(Object.fromEntries(res.min)))
        // apexChartData.mapWithMaxValues = resMap
    }
    apexChartData.values = apexChartData.xaxis?.categories
    apexChartData.propName = "bitDepthValue"
    return apexChartData
}

export default getBitDepthValueStatMixed
