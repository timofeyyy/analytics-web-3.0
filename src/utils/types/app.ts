import { AppEnum, ComponentTypeRuEnum } from "../enum/app.enum"
import { Capacitor } from "./capacitor"
import { ChartOptions } from "./chart"
import { ImageName } from "./config"
import { Diod } from "./diod"
import { Microchip } from "./microchip"
import { Transistor } from "./transistor"

// export interface DropdownOptions {
//     manufacturerName: Option
//     componentKind: Option,
//     componentName: Option,
//     propertyName: Partial<OptionProp>,
//     country: Partial<CountryOptions>

// }





export interface Manufacturer {
    manufacturerName: string,
    prodProcent: number,
    prodSummary: number

}

export interface ComponentKind {
    ruComponentKind: string
}

export interface ComponentName {
    componentName: string
}

export interface OptionsApi {
    manufacturerName: string,
    ruComponentKind: string,
    EnComponentKind: string,
    ruComponentType: ComponentTypeRuEnum,
    EnComponentType: ComponentTypeRuEnum,
    componentName: string
}

export interface Option {
    currentvalue: string,
    values: string[],
    open: boolean
}

// export interface OptionProp {
//     currentroute: ChartRoute
//     routes: ChartRoute[],
//     open: boolean,
//     values: (string | number)[],
//     currentValue: string | number
// }

export interface ChartData {
    chartOptions: Partial<ChartOptions>,
    values: string[]
}

export interface ChartType {
    checked: boolean,
    value: string
}

export interface ComponentType {
    checked: boolean,
    value: ComponentTypeRuEnum,
    manufacturer: Manufacturer,
    image: string
}

export interface ComponentData {
    [key: string]: Microchip[] | Capacitor[] | Diod[] | Transistor[]
}

export interface ChartTypes {
    bar: boolean,
    line: boolean,
    mixed: boolean,
    sorted: boolean,
    stacked: boolean
}

export interface CountryOptions {
    currentValue: Partial<ImageName>,
    open: boolean,
    values: Partial<ImageName>[]
}

export interface Test {
    ruComponentType: string,
    ruComponentKind: string,
    componentName: string,
    manufacturerName: string,
    html: any,
    img: string
}