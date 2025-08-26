import { HttpClient } from "@angular/common/http";
import { Injectable, OnInit } from "@angular/core";
import config from '../assets/appsetings.json'
import { map, Observable } from "rxjs";
import { Microchip } from "../utils/types/microchip";
import { Capacitor } from "../utils/types/capacitor";
import { Diod } from "../utils/types/diod";
import { Transistor } from "../utils/types/transistor";
import { AppEnum } from "../utils/enum/app.enum";
import { Config } from "../utils/types/config";
import { Resistor } from "../utils/types/resistors";
import { propsMap } from "../app/fetch.config";
import existInColumnsMin from "../utils/fnc1/other/exist_in_columns_min";
import existInColumnsMax from "../utils/fnc1/other/exists_in_columns_max";
import { componentStorage, fetchComponentTypes, initComponentTypes } from "../utils/redux/component";

@Injectable()
export class ApiService1 {

    private config!: Config

    constructor(
        private httpClient: HttpClient
    ) {
        this.config = JSON.parse(JSON.stringify(config))
    }

    private getReqDomen(endpoint: string): Observable<any> | null {
        if (this.config.api && this.config.api.url) {
            return this.httpClient.get(this.config.api.url + endpoint)
        }
        else {
            return null;
        }
    }

    getAlias(): Observable<any> | null {
        let obs: Observable<any> | null = this.getReqDomen("allias.json");
        if (obs != null) {
            return obs.pipe(map((names: any) => {
                return names;
            }))
        }
        return obs;
    }

    getMicrochips(data: Map<string, any> | void): Observable<Microchip[]> | null {
        let url: string = "api/microchips?"
        if (data) {
            let componentName: string | undefined = data.get('componentName')
            if (componentName) {
                url += `componentName=${componentName}`
            }
        }
        let obs: Observable<any> | null = this.getReqDomen(url);
        if (obs != null) {
            return obs.pipe(map((names: Microchip[]) => {
                return names
            }))
        }
        return obs;
    }

    getCapacitors(data: Map<string, any> | void): Observable<Capacitor[]> | null {
        let url: string = "api/capacitors?"
        if (data) {
            let componentName: string | undefined = data.get('componentName')
            if (componentName) {
                url += `componentName=${componentName}`
            }
        }
        let obs: Observable<any> | null = this.getReqDomen(url);
        if (obs != null) {
            return obs.pipe(map((names: Capacitor[]) => {
                return names
            }))
        }
        return obs;
    }

    getDiods(data: Map<string, any> | void): Observable<Diod[]> | null {
        let url: string = "api/diods?"
        if (data) {
            let componentName: string | undefined = data.get('componentName')
            if (componentName) {
                url += `componentName=${componentName}`
            }
        }

        let obs: Observable<any> | null = this.getReqDomen(url);
        if (obs != null) {
            return obs.pipe(map((names: Diod[]) => {
                return names
            }))
        }
        return obs;
    }

    getResistors(data: Map<string, any> | void): Observable<Resistor[]> | null {
        let url: string = "api/resistors?"
        if (data) {
            let componentName: string | undefined = data.get('componentName')
            if (componentName) {
                url += `componentName=${componentName}`
            }
        }

        let obs: Observable<any> | null = this.getReqDomen(url);
        if (obs != null) {
            return obs.pipe(map((names: Resistor[]) => {
                return names
            }))
        }
        return obs;
    }

    getTransistors(data: Map<string, any> | void): Observable<Transistor[]> | null {
        let url: string = "api/transistors?"

        if (data) {
            let componentName: string | undefined = data.get('componentName')
            if (componentName) {
                url += `componentName=${componentName}`
            }
        }
        let obs: Observable<any> | null = this.getReqDomen(url);
        if (obs != null) {
            return obs.pipe(map((names: Transistor[]) => {
                return names
            }))
        }
        return obs;
    }

    // create view tmp_view as select top 100 * from transistors
    // insert into resistors (docid, componentName, type_id, kind_id, manufacturername_id, powerrating, minvoltage, maxvoltage, minratedresistance, maxratedresistance, resistancetolerance, minoperatingtemperature, maxoperatingtemperature, currentlimit, package, qualicationSG, QualicationЕС, remark1, remark2 ) select top 100 docid, componentName, type_id, kind_id, manufacturername_id, null, null, null, null, null, null, minoperatingtemperature, maxoperatingtemperature, null, package, qualicationSG, QualicationЕС, remark1, remark2 from transistors;
    //SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE table_catalog = 'ComponentDB' AND table_name = 'resistors';    
    // getBitDepthValue(data: Map<string, any>): Observable<BitDepthValue[]> | null {
    //     let url: string = "api/microchips/bitdepthvalue?"
    //     const obj = Object.fromEntries(data)
    //     for (const key in obj) {
    //         if (key && key != AppEnum.ALL) {
    //             url += `${key}=${obj[key]}&&`
    //         }
    //     }
    //     let obs: Observable<any> | null = this.getReqDomen(url);
    //     if (obs != null) {
    //         return obs.pipe(map((items: BitDepthValue[]) => {
    //             return items
    //         }))
    //     }
    //     return obs;
    // }

    // getComponentsApiPreview(query: Map<string, any> | void): Observable<any[]> | null {

    //     let url: string = "api/components/short?"

    //     if (query) {
    //         let manufacturerName: string | null = query.get('manufacturerName')
    //         let componentType: string | null = query.get('ruComponentType')
    //         if (componentType) {
    //             url += `ruComponentType=${componentType}&&`
    //         }
    //         if (manufacturerName) {
    //             url += `manufacturerName=${manufacturerName}`
    //         }
    //     }
    //     let obs: Observable<any> | null = this.getReqDomen(url);
    //     if (obs != null) {
    //         return obs.pipe(map((components: any) => {
    //             return components.map(function (option: any): any {
    //                 return option;
    //             });
    //         }))
    //     }
    //     return obs;
    // }

    getComponentNames(): Observable<any> | null {
        let url: string = "api/components/names"
        let obs: Observable<any> | null = this.getReqDomen(url);
        if (obs != null) {
            return obs.pipe(map((items: any) => {
                return items
            }))
        }
        return obs;
    }

    getComponentsApiAll(query: Map<string, any> | void): Observable<any> | null {
        let url: string = "api/components/all?"
        let obs: Observable<any> | null = this.getReqDomen(url);
        if (obs != null) {
            return obs.pipe(map((res: any) => {
                if (query && res) {
                    const queryObject = Object.fromEntries(query)
                    let length = this.getActualQqueryLength(queryObject)
                    for (const type in res) {
                        let values = []
                        for (const obj of res[type]) {
                            let satisfyCount = 0;
                            for (const key in queryObject) {
                                if (
                                    (obj[key] == null && queryObject[key].replace(AppEnum.NOTDEFINED, null) == `${obj[key]}`) ||
                                    (obj[key] == '' && queryObject[key].replace(AppEnum.NOTDEFINED, "") == `${obj[key]}`) ||
                                    (existInColumnsMin(key) && !isNaN(Number(queryObject[key])) && obj[key] >= Number(queryObject[key])) ||
                                    (existInColumnsMax(key) && !isNaN(Number(queryObject[key])) && obj[key] <= queryObject[key]) ||
                                    (obj[key] && obj[key].toString().toLowerCase() == queryObject[key].toLowerCase()) ||
                                    (obj[key] == Number(queryObject[key]))

                                ) {
                                    satisfyCount++
                                }

                            }
                            if (length == satisfyCount) {
                                values.push(obj)
                            }
                        }
                        res[type] = values
                    }
                }
                return res
            }))
        }
        return obs;
    }
    getComponentsApiAllWithProirityLevels(query: Map<string, any> | void): Observable<any> | null {
        let url: string = "api/components/all?"
        let obs: Observable<any> | null = this.getReqDomen(url);
        if (obs != null) {
            componentStorage.dispatch(initComponentTypes())
            if (!Object.entries(componentStorage.getState().componentTypes).length) {
                componentStorage.dispatch(fetchComponentTypes(this));
            }
            const componentTypes: any[] = componentStorage.getState().componentTypes
            return obs.pipe(map((res: any) => {
                const priorities = new Map()
                priorities.set(AppEnum.ALL, [])
                let resWrapper = new Map()
                if (query && query.size) {
                    const queryObject = Object.fromEntries(query)
                    const ruComponentType = query.get('ruComponentType')
                    const componentTypesAlias = new Map<string, string>()
                    if (ruComponentType) {
                        const queryArr = this.getActualQqueryAsArray(queryObject)
                        for (const type in res) {
                            let values: any[] = []
                            for (const obj of res[type]) {
                                if (ruComponentType !== AppEnum.ALL && obj['ruComponentType'] !== ruComponentType) {
                                    break
                                }
                                for (let index = -1; index < queryArr.length; index++) {
                                    let satisfyCount = 0;
                                    if (index == -1) {
                                        for (const key in queryObject) {
                                            if (
                                                key !== 'ruComponentType' && (
                                                    (obj[key] == '' && queryObject[key].replace(AppEnum.NOTDEFINED, '') == obj[key]) ||
                                                    (obj[key] == null && queryObject[key].replace(AppEnum.NOTDEFINED, null) == `${obj[key]}`) ||
                                                    (existInColumnsMin(key) && !isNaN(Number(queryObject[key])) && obj[key] >= Number(queryObject[key])) ||
                                                    (existInColumnsMax(key) && !isNaN(Number(queryObject[key])) && obj[key] <= queryObject[key]) ||
                                                    (obj[key] == queryObject[key]) ||
                                                    (obj[key] == Number(queryObject[key]))
                                                )
                                            ) {
                                                satisfyCount++
                                            }
                                        }
                                        if (queryArr.length == satisfyCount) {
                                            (priorities.get(AppEnum.ALL) as any[]).push(obj)
                                        }
                                    }
                                    else {
                                        let j = 0;
                                        for (; j < queryArr.length, j <= index; j++) {
                                            if (
                                                (
                                                    (obj[queryArr[j]] == '' && queryObject[queryArr[j]].replace(AppEnum.NOTDEFINED, '') == obj[queryArr[j]]) ||
                                                    (obj[queryArr[j]] == null && queryObject[queryArr[j]].replace(AppEnum.NOTDEFINED, null) == `${obj[queryArr[j]]}`) ||
                                                    (existInColumnsMin(queryArr[j]) && !isNaN(Number(queryObject[queryArr[j]])) && obj[queryArr[j]] >= Number(queryObject[queryArr[j]])) ||
                                                    (existInColumnsMax(queryArr[j]) && !isNaN(Number(queryObject[queryArr[j]])) && obj[queryArr[j]] <= queryObject[queryArr[j]]) ||
                                                    (obj[queryArr[j]] == queryObject[queryArr[j]]) ||
                                                    (obj[queryArr[j]] == Number(queryObject[queryArr[j]]))
                                                )
                                            ) {
                                                satisfyCount++
                                            }
                                        }
                                        if (!priorities.get(queryArr[index])) {
                                            priorities.set(queryArr[index], [])
                                        }
                                        if (satisfyCount === j) {
                                            (priorities.get(queryArr[index]) as any[]).push(obj)
                                        }
                                    }
                                }
                            }
                            res[type] = values
                        }
                        const componentType = componentTypes.find((val) => val['ruComponentType'] === ruComponentType)
                        resWrapper.set((componentType['enComponentType'] as string).toLowerCase(), priorities)
                        // componentTypes.map((val, index) => )
                        // if (prioritySchemaWrapperMap.get(ruComponentType)) {
                        //     const name = prioritySchemaWrapperMap.get(queryObject['ruComponentType'])
                        // }
                        console.log(resWrapper)
                    }

                }
                else {
                    for (const type in res) {
                        resWrapper.set(type, new Map().set(AppEnum.ALL, res[type]))
                    }
                }
                return resWrapper

            }))
        }
        return obs;
    }

    private getActualQqueryLength(query: any): number {
        let length = 0
        for (const key in query) {
            if (propsMap.get(key)) {
                length++
            }
        }
        return length
    }
    private getActualQqueryAsArray(query: any): string[] {
        const columns = []
        for (const key in query) {
            if (propsMap.get(key) && key !== 'ruComponentType') {
                columns.push(key)
            }
        }
        return columns
    }
}