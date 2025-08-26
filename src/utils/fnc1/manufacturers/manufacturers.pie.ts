import { ChartOptions } from "../../types/chart";


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
            show: true,
            position: 'bottom',
            horizontalAlign: 'center'
        },
        values: [],
         responsive: [
            {
                breakpoint: 300,
                options: {
                    legend: {
                        position: "bottom"
                    }
                }
            }
        ],
    };

    var map = new Map();
    for (const key in data) {
        for (const obj of data[key]) {
            let labelsItemIndex: number = (apexChartData as ChartOptions).labels.findIndex(
                (category: string) => category === obj.manufacturerName
            )

            if (labelsItemIndex === -1) {
                (apexChartData as ChartOptions).labels.push(obj.manufacturerName)
            }

            if (map.get(obj.manufacturerName) === undefined) {
                map.set(obj.manufacturerName, 0)
            }

            map.set(obj.manufacturerName, map.get(obj.manufacturerName) + 1)
        }
    }
    (apexChartData as ChartOptions).labels.forEach((label: string) => {
        (apexChartData as ChartOptions).series.push(map.get(label));
    })
    // const sortedMap = new Map([...map.entries()].sort((a, b) => b[1] - a[1]));
    // let res = getMinMax(sortedMap)
    // window.localStorage.setItem('mapWithMaxValues', JSON.stringify(Object.fromEntries(res.max)))
    // window.localStorage.setItem('mapWithMinValues', JSON.stringify(Object.fromEntries(res.min)))
    apexChartData.values = apexChartData.labels
    return apexChartData
}

export default getManufacturersChartOptionPie1