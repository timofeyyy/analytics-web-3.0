import { ComponentTypeRuEnum } from "../enum/app.enum"
import { Capacitor } from "./capacitor"
import { Diod } from "./diod"
import { Microchip } from "./microchip"
import { Transistor } from "./transistor"

// export interface ComponentLabel {
//     manufacturerName: string,
//     ruComponentKind: string,
//     ruComponentType: ComponentTypeRuEnum,
//     componentName: string
// }

export interface DropBox {
    currentValue: string,
    open: boolean,
    values: any[]
}
export interface FilterDropBox extends DropBox {
    propName: string,
    sort: (props: any, all: ComponentOptions[]) => string[] | undefined,
    componentProps: Map<string, any>
}
export interface ComponentOptions {
    component: Microchip | Transistor | Capacitor | Diod
    filters: string[]
    html: any
}
