export interface RuComponentTypeStatistic {
    procentAll: number,
    manufacturers: Map<string, ManufacturerStatistic>,
    countAll: number
}

export interface ManufacturerStatistic {
    procentComapredToAll: number,
    procentComparedToComponentTypes: number
}

const getComponentTypesStat = (data: any): Map<string, RuComponentTypeStatistic> => {
    let map: Map<string, RuComponentTypeStatistic> = new Map()
    let summary = 0
    for (const key in data) {
        summary += data[key].length
        for (const obj of data[key]) {
            if (!map.get(obj.ruComponentType)) {
                map.set(obj.ruComponentType, {
                    procentAll: 0,
                    countAll: data[key].length,
                    manufacturers: new Map()
                })
            }
            let manufacturers = map.get(obj.ruComponentType)?.manufacturers
            if (!manufacturers?.get(obj.manufacturerName)) {
                manufacturers?.set(obj.manufacturerName, {
                    procentComapredToAll: 0,
                    procentComparedToComponentTypes: 0
                })
            }
            manufacturers!.set(obj.manufacturerName, {
                procentComapredToAll: manufacturers!.get(obj.manufacturerName)?.procentComapredToAll! + 1,
                procentComparedToComponentTypes: manufacturers!.get(obj.manufacturerName)?.procentComparedToComponentTypes! + 1,
            })
        }
    }

    const object = Object.fromEntries(map)
    for (const key in object) {
        const manufacturers = Object.fromEntries(object[key].manufacturers)
        for (const name in manufacturers) {
            manufacturers[name] = {
                procentComapredToAll: Number(((manufacturers[name].procentComapredToAll * 100) / summary).toFixed(1)),
                procentComparedToComponentTypes: Number((manufacturers[name].procentComparedToComponentTypes * 100 / object[key].countAll).toFixed(1))
            }
        }
        // console.log(new Map(Object.entries(manufacturers)))
        let obj: RuComponentTypeStatistic = {
            procentAll: Number(((object[key].countAll * 100) / summary).toFixed(1)),
            countAll: object[key].countAll,
            manufacturers: getTopManufacturers(new Map(Object.entries(manufacturers)))
        }
        
        map.set(key, obj)
    }

    return map;
}

const getTopManufacturers = (manufacturers: Map<string, ManufacturerStatistic>): Map<string, ManufacturerStatistic> => {
    let arr = Array.from(manufacturers).sort((a, b) => b[1].procentComapredToAll - a[1].procentComapredToAll)
    if (arr.length) {
        let values: any = []
        let max = arr[0][1].procentComapredToAll
        for (const element of arr) {
            if (element[1].procentComapredToAll !== max) {
                break
            }
            values.push(element)
        }
        arr = values
    }
    return new Map(arr.map((obj) => [obj[0], obj[1]]))
}

export default getComponentTypesStat