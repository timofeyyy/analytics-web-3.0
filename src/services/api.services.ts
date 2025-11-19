import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, OnInit } from "@angular/core";
import { concatMap, filter, map, Observable, of, shareReplay, switchMap, take, tap } from "rxjs";
import { Microchip } from "../utils/types/microchip";
import { Capacitor } from "../utils/types/capacitor";
import { Diod } from "../utils/types/diod";
import { Transistor } from "../utils/types/transistor";
import { AppEnum } from "../utils/enum/app.enum";
import { Config } from "../utils/types/config";
import { Resistor } from "../utils/types/resistors";
// import { propsMap } from "../app/fetch.config";
import { existInColumnsMax, existInColumnsMin } from "../utils/static-data/compared-min-max";
import { Columns } from "../utils/types/app";
// import { propsMap } from "../app/fetch.config";

@Injectable()
export class ApiService {

    constructor(
        private httpClient: HttpClient
    ) { }

    getApiAdress(): Observable<any> {
        return this.httpClient.get("/assets/appsetings.json")
    }

    getPdfPath(): Observable<string> {
        return this.getApiAdress().pipe(map((adr) => {
            return adr.api.url + "datasheets/"
        }),
            shareReplay(1))
    }

    sendGetReq(endpoint: string, headers: any = {}): Observable<any> {
        return this.getApiAdress().pipe(
            switchMap(res => {
                return this.httpClient.get(res.api.url + endpoint, headers)
            })
        )
    }

    sendPostReq(endpoint: string, data: any, headers: any = {}): Observable<any> {
        return this.getApiAdress().pipe(
            switchMap(res => {
                return this.httpClient.post(res.api.url + endpoint, data, headers)
            })
        )
    }

    getAlias(): Observable<{ [type: string]: string }> {
        return this.sendGetReq('alias.json').pipe(
            tap(data => data)
        );
    }

    getColumns(enType: string | void): Observable<any> {
        let url: string = `api/components${enType ? "/" + enType!.toLowerCase() : ''}/columns/all`
        let obs: Observable<any> = this.sendGetReq(url);
        if (obs != null) {
            return obs.pipe()
        }
        return obs;
    }

    getComponent(entype: string, id: number): Observable<any> {
        let url: string = `api/components/${entype}/${id}`
        let obs: Observable<any> = this.sendGetReq(url);
        if (obs != null) {
            return obs.pipe()
        }
        return obs;
    }

    getComponentNames(): Observable<any> {
        let url: string = "api/components/names"
        let obs: Observable<any> = this.sendGetReq(url);
        if (obs != null) {
            return obs.pipe()
        }
        return obs;
    }

    getQueryByPriorities(entype: string, columns: { ruVal: string, enVal: string }[], query: Map<string, any>): Observable<any> | null {
        let str = ''
        // console.log(columns, query.keys)
        for (const key of query.keys()) {
            var pair = columns.find(c => c.enVal.toLowerCase() == key.toLowerCase())
            if (pair) {
                // console.log(query.get(key), AppEnum.NOTDEFINED, AppEnum.NOTDEFINED === query.get(key))
                str += `${key}=${query.get(key) === AppEnum.NOTDEFINED ? 'null' : query.get(key)}&`
            }
        }
        let url: string = `api/components/${entype.toLowerCase()}/priorities?${str}`
        // console.log(url)

        let obs: Observable<any> = this.sendGetReq(url);
        if (obs != null) {
            return obs.pipe()
        }
        return obs;
    }


    getComponentsApiAll(query: Map<string, any> | void): Observable<any> {
        let alias: { [column: string]: string }
        if (query) {
            alias = query.get("alias")
        }
        let url: string = "api/components/all?"
        console.log(url)
        let obs: Observable<any> = this.sendGetReq(url);
        if (obs != null) {
            return obs.pipe(map((res: any) => {
                if (query && res) {
                    const queryObject = Object.fromEntries(query)
                    let length = this.getActualQqueryLength(alias, queryObject)
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

    makeReport(formData: FormData, entype: string): Observable<any> {
        let url: string = `report/${entype}/pdf`
        return this.sendPostReq(url, formData, { responseType: 'blob' })
    }

    private getActualQqueryLength(query: any, alias: { [type: string]: string }): number {
        let length = 0
        for (const key in query) {
            if (alias[key]) {
                length++
            }
        }
        return length
    }
}