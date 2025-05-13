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

    getChartConfig() : ChartConfig[] {
        return this.config.chart
    }


    getMicrochips(): Observable<Microchip[]> | null {
        let obs: Observable<any> | null = this.getReqDomen("api/microchips");
        if (obs != null) {
            return obs.pipe(map((names: Microchip[]) => {
                return names.map(function (name: Microchip): Microchip {
                    return name;
                });
            }))
        }
        return obs;
    }

    getCapacitors(): Observable<Capacitor[]> | null {
        let obs: Observable<any> | null = this.getReqDomen("api/capacitors");
        if (obs != null) {
            return obs.pipe(map((names: Capacitor[]) => {
                return names.map(function (name: Capacitor): Capacitor {
                    return name;
                });
            }))
        }
        return obs;
    }

    getDiods(): Observable<Diod[]> | null {
        let obs: Observable<any> | null = this.getReqDomen("api/diods");
        if (obs != null) {
            return obs.pipe(map((names: Diod[]) => {
                return names.map(function (name: Diod): Diod {
                    return name;
                });
            }))
        }
        return obs;
    }
    
    getTransistors(): Observable<Transistor[]> | null {
        let obs: Observable<any> | null = this.getReqDomen("api/transistors");
        if (obs != null) {
            return obs.pipe(map((names: Transistor[]) => {
                return names.map(function (name: Transistor): Transistor {
                    return name;
                });
            }))
        }
        return obs;
    }
    getBitDepthValue(data: Map<string, any>): Observable<BitDepthValue[]> | null {
        let url: string = "api/microchips/bitdepthvalue?"
        let manufacturerName: string | null = data.get('manufacturerName')
        let componentKind: string | null = data.get('componentKind')
        let componentName: string | null = data.get('componentName')

        if(manufacturerName) {
            url+=`ManufacturerName=${manufacturerName}&&`
        }
        if(componentKind) {
            url+=`componentKind=${componentKind}&&`
        }
        if(componentName) {
            url+=`componentName=${componentName}`
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

    getComponentsApi(data: Map<string, any>): Observable<ComponentLabel[]> | null {

        let url: string = "api/components?"
        let manufacturerName: string | null = data.get('manufacturerName')
        let componentType: string | null = data.get('componentType')

        if(componentType) {
            url+=`componentType=${componentType}&&`
        }
        if(manufacturerName) {
            url+=`manufacturerName=${manufacturerName}`
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