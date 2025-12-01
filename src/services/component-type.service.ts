import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Columns, ComponentTypes } from "../utils/types/app";

@Injectable()
export class ComponentTypeService {

    private _componentTypes!: ComponentTypes[]
    private _cuurrentComponentType!: ComponentTypes
    private _columnsAll!: { [type:string]: Columns[] }
    private _alias!: { [type:string]: string }
    getComponentTypeByEn(entype: string): ComponentTypes | undefined {
        // const enComponentType = query.get('enComponentType')
        return this._componentTypes.find(ct => ct.enComponentType.toLowerCase() == `${entype}`.toLowerCase())
    }
    getComponentTypeByRu(rutype: string): ComponentTypes | undefined {
        // const ruComponentType = query.get('ruComponentType')
        // // // console.log(ruComponentType, query.get('ruComponentType'))

        return this._componentTypes.find(ct => ct.ruComponentType.toLowerCase() == `${rutype}`.toLowerCase())
    }
    setComponentTypes(componentTypes: ComponentTypes[]) {
        this._componentTypes = componentTypes
    }
    getComponentTypes(): ComponentTypes[] {
        return this._componentTypes
    }
    setCurrentComponentType(componentTypes: ComponentTypes) {
        this._cuurrentComponentType = componentTypes
    }
    getCurrentComponentType(): ComponentTypes {
        return this._cuurrentComponentType
    }
    setColumnsAll(columnsAll: { [type:string]: Columns[] }) {
        this._columnsAll = columnsAll
    }
    getColumnsAll(): { [type:string]: Columns[] } {
        return this._columnsAll
    }
    setAlias(alias: { [column:string]: string }): void {
        this._alias = alias
    }
    getAlias(): { [column:string]: string } {
        return this._alias
    }
}