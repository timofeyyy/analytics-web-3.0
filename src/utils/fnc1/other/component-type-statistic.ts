import { ComponentTypes } from "../../types/app"

export interface ComponentTypePopup {
    statistic: ComponentTypeStatistic,
    enterLink: boolean,
    enterPopupWindow: boolean,
    kinds: { ruComponentKind: string, enComponentKind: string, countAll: number }[]
}

export interface ComponentTypeStatistic {
    procentAll: number,
    manufacturer: { name: string, statistic: ManufacturerStatistic } | undefined,
    manufacturers: Map<string, ManufacturerStatistic>,
    countAll: number,
}

export interface ManufacturerStatistic {
    procentComapredToAll: number,
    procentComparedToComponentTypes: number
}

const getComponentTypesStat = (data: any, ru: boolean, componentTypes: ComponentTypes[]): Map<string, ComponentTypePopup> => {
    let map: Map<string, ComponentTypePopup> = new Map()
    let summary = 0
    // const componentType = ru ? 'ruComponentType' : 'enComponentType'
    // console.log(data, componentTypes)
    for (const key in data) {
        summary += data[key].length
        const componentType = componentTypes.find(c => c.enComponentType.toLowerCase() == key.toLowerCase())
        map.set(componentType?.ruComponentType!, {
            statistic: {
                procentAll: 0,
                countAll: data[key].length,
                manufacturers: new Map(),
                manufacturer: undefined
            },
            enterLink: false,
            enterPopupWindow: false,
            kinds: []
        })
        const kinds: { ruComponentKind: string, enComponentKind: string, countAll: number }[] = []
        for (const obj of data[key]) {
            let manufacturers = map.get(componentType?.ruComponentType!)?.statistic.manufacturers
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
            const existKind = kinds.findIndex(kind => kind.ruComponentKind == obj.ruComponentKind)
            if (existKind == -1) {
                kinds.push({ ruComponentKind: obj.ruComponentKind, enComponentKind: obj.enComponentKind, countAll: 1 })
            }
            else {
                kinds[existKind].countAll += 1
            }
        }
        map.get(componentType?.ruComponentType!)!.kinds = kinds
    }
    // console.log(map)

    const object = Object.fromEntries(map)
    for (const key in object) {
        const manufacturers = Object.fromEntries(object[key].statistic.manufacturers)
        for (const name in manufacturers) {
            manufacturers[name] = {
                procentComapredToAll: Number(((manufacturers[name].procentComapredToAll * 100) / summary).toFixed(1)),
                procentComparedToComponentTypes: Number((manufacturers[name].procentComparedToComponentTypes * 100 / object[key].statistic.countAll).toFixed(1))
            }
        }
        // // // console.log(new Map(Object.entries(manufacturers)))
        const bestManufacturer = getBestManufacturer(new Map(Object.entries(manufacturers)))
        const obj: ComponentTypeStatistic = {
            procentAll: Number(((object[key].statistic.countAll * 100) / summary).toFixed(1)),
            countAll: object[key].statistic.countAll,
            manufacturers: getTopManufacturers(new Map(Object.entries(manufacturers))),
            manufacturer: { name: bestManufacturer[0], statistic: bestManufacturer[1] }
        }
        map.get(key)!.statistic = obj
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

const getBestManufacturer = (manufacturers: Map<string, ManufacturerStatistic>): [string, ManufacturerStatistic] => {
    let arr = Array.from(manufacturers).sort((a, b) => b[1].procentComapredToAll - a[1].procentComapredToAll)
    return [arr[0][0], arr[0][1]]
}


export default getComponentTypesStat