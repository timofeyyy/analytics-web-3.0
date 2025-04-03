import { HttpClient } from "@angular/common/http";
import { Injectable, OnInit } from "@angular/core";
import config from '../assets/app.config.json'
import { map, Observable } from "rxjs";
import { ComponentKind, ComponentName, Manufacturer, OptionsApi } from "../utils/types/app";
import { BitDepthValue, Microchip } from "../utils/types/microchip";
import { Capacitor } from "../utils/types/capacitor";
import { Diod } from "../utils/types/diod";
import { Transistor } from "../utils/types/transistor";
import { AppEnum } from "../utils/enum/app.enum";
import { ChartConfig, Config, ImageName } from "../utils/types/config";

@Injectable()
export class ApiService {

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

    getManufacturer(): Observable<Manufacturer[]> | null {
        let obs: Observable<any> | null = this.getReqDomen("api/manufacturers");
        if (obs != null) {
            return obs.pipe(map((manufacturer: Manufacturer[]) => {
                return manufacturer.map(function (name: Manufacturer): Manufacturer {
                    return name;
                });
            }))
        }
        return obs;
    }

    // getComponentKinds(): Observable<ComponentKind[]> | null {
    //     let obs: Observable<any> | null = this.getReqDomen("api/componentKinds");
    //     if (obs != null) {
    //         return obs.pipe(map((kinds: ComponentKind[]) => {
    //             return kinds.map(function (kind: ComponentKind): ComponentKind {
    //                 return kind;
    //             });
    //         }))
    //     }
    //     return obs;
    // }

    getComponentNames(): Observable<ComponentName[]> | null {
        let obs: Observable<any> | null = this.getReqDomen("api/componentNames");
        if (obs != null) {
            return obs.pipe(map((names: ComponentName[]) => {
                return names.map(function (name: ComponentName): ComponentName {
                    return name;
                });
            }))
        }
        return obs;
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
    // http://localhost:5000/api/microchips/bitdepthvalue?ManufacturerName=sds&componentKind=dsd&componentName=sdd&bitdepthvalue=sds
    getBitDepthValue(manufacturerName: string | undefined = undefined, componentKind: string | undefined = undefined, componentName: string | undefined = undefined): Observable<BitDepthValue[]> | null {
        let url: string = "api/microchips/bitdepthvalue?"
        if(manufacturerName) {
            url+=`ManufacturerName=${manufacturerName}&`
        }
        if(componentKind) {
            url+=`componentKind=${componentKind}&`
        }
        if(componentName) {
            url+=`componentName=${componentName}&`
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

 

    // getOptionsApi(): Observable<OptionsApi[]> | null {
    //     let obs: Observable<any> | null = this.getApi("api/test");
    //     if (obs != null) {
    //         return obs.pipe(map((options: OptionsApi[]) => {
    //             return options.map(function (option: OptionsApi): OptionsApi {
    //                 return option;
    //             });
    //         }))
    //     }
    //     return obs;
    // }

    getOptionsApi(componentType: string | void, manufacturerName: string | void): Observable<OptionsApi[]> | null {

        let url: string = "api/test"
        if(componentType != null) {
            url+=`?componentType=${componentType}`
        }
        if(manufacturerName != null) {
            url+=`?manufacturerName=${manufacturerName}`
        }
        console.log(url)

        let obs: Observable<any> | null = this.getReqDomen(url);
        if (obs != null) {
            return obs.pipe(map((options: OptionsApi[]) => {
                return options.map(function (option: OptionsApi): OptionsApi {
                    return option;
                });
            }))
        }
        return obs;
    }


    getApiByComponentType(url: string): Observable<any> | null {
        let obs: Observable<any> | null = this.getReqDomen(`api/${url}`);
        if (obs != null) {
            return obs.pipe(map((values: any) => {
                return values.map(function (value: any): any {
                    return value;
                });
            }))
        }
        return obs;
    }
}