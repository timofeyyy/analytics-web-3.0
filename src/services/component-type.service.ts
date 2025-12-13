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
        // const EnComponentType = query.get('EnComponentType')
        return this._componentTypes.find(ct => ct.EnComponentType.toLowerCase() == `${entype}`.toLowerCase())
    }
    getComponentTypeByRu(rutype: string): ComponentTypes | undefined {
        // const RuComponentType = query.get('RuComponentType')
        // // // console.log(RuComponentType, query.get('RuComponentType'))

        return this._componentTypes.find(ct => ct.RuComponentType.toLowerCase() == `${rutype}`.toLowerCase())
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