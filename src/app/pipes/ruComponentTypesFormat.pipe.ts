import { Pipe, PipeTransform } from "@angular/core";
import { AppEnum, ComponentTypeEnEnum, ComponentTypeRuEnum } from "../../utils/enum/app.enum";

@Pipe({
    name: "ruComponentTypeFormat",
    standalone: true
})
export class RuComponentTypeFormatPipe implements PipeTransform {
    localAllias = {
        "microchips": ComponentTypeRuEnum.MICROCHIP,
        "diods": ComponentTypeRuEnum.DIOD,
        "transistors": ComponentTypeRuEnum.TRANSISTOR,
        "capacitors": ComponentTypeRuEnum.CAPACITOR,
        "resistors": ComponentTypeRuEnum.RESISTOR
    }
    transform(value: ComponentTypeEnEnum, args?: any): string {
        return this.localAllias[value]
    }
}