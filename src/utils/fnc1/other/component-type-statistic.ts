import { ComponentTypes } from "../../types/app"

export interface ComponentTypePopup {
    statistic: ComponentTypeStatistic,
    enterLink: boolean,
    enterPopupWindow: boolean,
    kinds: { RuComponentKind: string, EnComponentKind: string, countAll: number }[]
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
    // const componentType = ru ? 'RuComponentType' : 'EnComponentType'
    for (const key in data) {
        summary += data[key].length
        const componentType = componentTypes.find(c => c.EnComponentType == key)
        map.set(componentType?.RuComponentType!, {
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
        const kinds: { RuComponentKind: string, EnComponentKind: string, countAll: number }[] = []
        for (const obj of data[key]) {
            let manufacturers = map.get(componentType?.RuComponentType!)?.statistic.manufacturers
            if (!manufacturers?.get(obj.ManufacturerName)) {
                manufacturers?.set(obj.ManufacturerName, {
                    procentComapredToAll: 0,
                    procentComparedToComponentTypes: 0
                })
            }
            manufacturers!.set(obj.ManufacturerName, {
                procentComapredToAll: manufacturers!.get(obj.ManufacturerName)?.procentComapredToAll! + 1,
                procentComparedToComponentTypes: manufacturers!.get(obj.ManufacturerName)?.procentComparedToComponentTypes! + 1,
            })
            const existKind = kinds.findIndex(kind => kind.RuComponentKind == obj.RuComponentKind)
            if (existKind == -1) {
                kinds.push({ RuComponentKind: obj.RuComponentKind, EnComponentKind: obj.EnComponentKind, countAll: 1 })
            }
            else {
                kinds[existKind].countAll += 1
            }
        }
        map.get(componentType?.RuComponentType!)!.kinds = kinds
    }

    const object = Object.fromEntries(map)
    for (const key in object) {
        const manufacturers = Object.fromEntries(object[key].statistic.manufacturers)
        for (const name in manufacturers) {
            manufacturers[name] = {
                procentComapredToAll: Number(((manufacturers[name].procentComapredToAll * 100) / summary).toFixed(1)),
                procentComparedToComponentTypes: Number((manufacturers[name].procentComparedToComponentTypes * 100 / object[key].statistic.countAll).toFixed(1))
            }
        }
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