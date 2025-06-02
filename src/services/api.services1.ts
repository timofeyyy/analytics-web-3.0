import { HttpClient } from "@angular/common/http";
import { Injectable, OnInit } from "@angular/core";
import config from '../assets/app.config.json'
import { map, Observable } from "rxjs";
import { ComponentLabel } from "../utils/types/app";
import { BitDepthValue, Microchip } from "../utils/types/microchip";
import { Capacitor } from "../utils/types/capacitor";
import { Diod } from "../utils/types/diod";
import { Transistor } from "../utils/types/transistor";
import { AppEnum } from "../utils/enum/app.enum";
import { ChartConfig, Config, ImageName } from "../utils/types/config";
import { Resistor } from "../utils/types/resistors";

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

    getCountriesFromConfig(): ImageName[] {
        return this.config.countries;
    }

    getComponentsFromConfig(): ImageName[] {
        return this.config.components;
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
        let url: string = "api/microchips"
        if (data) {
            let componentName: string | null = data.get('componentName')
            if (componentName) {
                url += `?componentName=${componentName}`
            }
        }
        let obs: Observable<any> | null = this.getReqDomen(url);
        if (obs != null) {
            return obs.pipe(map((names: Microchip[]) => {
                return names.map(function (name: Microchip): Microchip {
                    return name;
                });
            }))
        }
        return obs;
    }

    getCapacitors(data: Map<string, any> | void): Observable<Capacitor[]> | null {
        let url: string = "api/capacitors"
        if (data) {
            let componentName: string | null = data.get('componentName')
            if (componentName) {
                url += `?componentName=${componentName}`
            }
        }
        let obs: Observable<any> | null = this.getReqDomen(url);
        if (obs != null) {
            return obs.pipe(map((names: Capacitor[]) => {
                return names.map(function (name: Capacitor): Capacitor {
                    return name;
                });
            }))
        }
        return obs;
    }

    getDiods(data: Map<string, any> | void): Observable<Diod[]> | null {
        let url: string = "api/diods"
        if (data) {
            let componentName: string | null = data.get('componentName')
            if (componentName) {
                url += `?componentName=${componentName}`
            }
        }

        let obs: Observable<any> | null = this.getReqDomen(url);
        if (obs != null) {
            return obs.pipe(map((names: Diod[]) => {
                return names.map(function (name: Diod): Diod {
                    return name;
                });
            }))
        }
        return obs;
    }

    getResistors(data: Map<string, any> | void): Observable<Resistor[]> | null {
        let url: string = "api/resistors"
        if (data) {
            let componentName: string | null = data.get('componentName')
            if (componentName) {
                url += `?componentName=${componentName}`
            }
        }

        let obs: Observable<any> | null = this.getReqDomen(url);
        if (obs != null) {
            return obs.pipe(map((names: Resistor[]) => {
                return names.map(function (name: Resistor): Resistor {
                    return name;
                });
            }))
        }
        return obs;
    }

    getTransistors(data: Map<string, any> | void): Observable<Transistor[]> | null {
        let url: string = "api/transistors"
        if (data) {
            let componentName: string | null = data.get('componentName')
            if (componentName) {
                url += `?componentName=${componentName}`
            }
        }
        let obs: Observable<any> | null = this.getReqDomen(url);
        if (obs != null) {
            return obs.pipe(map((names: Transistor[]) => {
                return names.map(function (name: Transistor): Transistor {
                    return name;
                });
            }))
        }
        return obs;
    }
    //create view tmp_view as select * from transistors where
    //insert into resistors (docid, componentName, type_id, kind_id, manufacturername_id, powerrating, minvoltage, maxvoltage, minratedresistance, maxratedresistance, resistancetolerance, minoperatingtemperature, maxoperatingtemperature, currentlimit, package, qualicationSG, QualicationЕС, remark1, remark2 ) select top 100 docid, componentName, type_id, kind_id, manufacturername_id, null, null, null, null, null, null, minoperatingtemperature, maxoperatingtemperature, null, package, qualicationSG, QualicationЕС, remark1, remark2 from transistors;
    //SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE table_catalog = 'ComponentDB' AND table_name = 'resistors';    
    getBitDepthValue(data: Map<string, any>): Observable<BitDepthValue[]> | null {
        let url: string = "api/microchips/bitdepthvalue?"
        let manufacturerName: string | null = data.get('manufacturerName')
        let componentKind: string | null = data.get('ruComponentKind')
        let componentName: string | null = data.get('componentName')

        if (manufacturerName) {
            url += `manufacturerName=${manufacturerName}&&`
        }
        if (componentKind) {
            url += `ruComponentKind=${componentKind}&&`
        }
        if (componentName) {
            url += `componentName=${componentName}`
        }
        console.log(url)
        let obs: Observable<any> | null = this.getReqDomen(url);
        if (obs != null) {
            return obs.pipe(map((items: BitDepthValue[]) => {
                return items.map(function (item: BitDepthValue): BitDepthValue {
                    return item;
                });
            }))
        }
        return obs;
    }

    getComponentsApi(data: Map<string, any> | void): Observable<ComponentLabel[]> | null {

        let url: string = "api/components?"
        if (data) {
            let manufacturerName: string | null = data.get('manufacturerName')
            let componentType: string | null = data.get('ruComponentType')
            if (componentType) {
                url += `ruComponentType=${componentType}&&`
            }
            if (manufacturerName) {
                url += `manufacturerName=${manufacturerName}`
            }
        }
        let obs: Observable<any> | null = this.getReqDomen(url);
        if (obs != null) {
            return obs.pipe(map((options: ComponentLabel[]) => {
                return options.map(function (option: ComponentLabel): ComponentLabel {
                    return option;
                });
            }))
        }
        return obs;
    }
}