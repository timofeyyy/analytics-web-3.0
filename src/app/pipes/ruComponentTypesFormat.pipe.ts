import { Pipe, PipeTransform } from "@angular/core";
import { AppEnum, ComponentTypeRuEnum } from "../../utils/enum/app.enum";

@Pipe({
    name: "ruComponentTypeFormat",
    standalone: true
})
export class RuComponentTypeFormatPipe implements PipeTransform {
    localAllias : any= {
        "microchip": ComponentTypeRuEnum.MICROCHIP,
        "diod": ComponentTypeRuEnum.DIOD,
        "transistor": ComponentTypeRuEnum.TRANSISTOR,
        "capacitor": ComponentTypeRuEnum.CAPACITOR,
        "resistor": ComponentTypeRuEnum.RESISTOR
    }
    transform(value: string, args?: any): string {
        return this.localAllias[value] ?? ""
    }
}