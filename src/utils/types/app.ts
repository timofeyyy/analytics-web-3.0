import { AppEnum, ComponentTypeRuEnum } from "../enum/app.enum"
import { Capacitor } from "./capacitor"
import { ChartOptions } from "./chart"
import { ImageName } from "./config"
import { Diod } from "./diod"
import { Microchip } from "./microchip"
import { Transistor } from "./transistor"


export interface Manufacturer {
    manufacturerName: string,
    prodProcent: number,
    prodSummary: number

}



export interface ComponentLabel {
    manufacturerName: string,
    ruComponentKind: string,
    ruComponentType: ComponentTypeRuEnum,
    componentName: string
}

export interface DropBox {
    currentValue: Partial<ImageName> | string,
    open: boolean,
    values: any[]
}

export interface ComponentTypesCheckBoxes   {
    checked: boolean,
    manufacturer: Manufacturer,
    image: Partial<ImageName>
    // image: string
    // value: ComponentTypeRuEnum,

}

export interface FilterDropBox extends DropBox {
    propName: string,
    // currentvalue: string,
    // values: string[],
    // open: boolean,
    sort: (props: any, all: ComponentOptions[]) => string[] | undefined,
    componentProps: Map<string, any>
}
// export interface OptionProp {
//     currentroute: ChartRoute
//     routes: ChartRoute[],
//     open: boolean,
//     values: (string | number)[],
//     currentValue: string | number
// }

// export interface ChartData {
//     chartOptions: Partial<ChartOptions>,
//     values: string[]
// }

export interface ChartType {
    checked: boolean,
    value: string
}

// export interface ComponentType {
//     checked: boolean,
//     value: ComponentTypeRuEnum,
//     manufacturer: Manufacturer,
//     image: string
// }


// export interface CountryOptions {
//     currentValue: Partial<ImageName>,
//     open: boolean,
//     values: Partial<ImageName>[]
// }

export interface ComponentOptions {
    component: Microchip | Transistor | Capacitor | Diod
    // ruComponentType: string,
    // ruComponentKind: string,
    // componentName: string,
    // manufacturerName: string,
    filters: string[]
    html: any
    img: string
}
