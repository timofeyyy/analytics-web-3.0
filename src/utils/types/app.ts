import { ComponentTypeRuEnum } from "../enum/app.enum"
import { Capacitor } from "./capacitor"
import { Diod } from "./diod"
import { Microchip } from "./microchip"
import { Resistor } from "./resistors"
import { Transistor } from "./transistor"


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
    component: Microchip | Transistor | Capacitor | Diod | Resistor
    html: any
}

export interface ComponentTypes {
    ruComponentType: string,
    enComponentType: string
}


