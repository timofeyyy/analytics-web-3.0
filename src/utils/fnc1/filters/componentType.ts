import { AppEnum } from "../../enum/app.enum"
import { ComponentOptions } from "../../types/app"
import {  componentStorage, setColumns } from "../../redux/storage"
   
const componentTypeFilters = (propName: string, all: Partial<ComponentOptions>[]): string[] => {
    let values: string[] = (componentStorage.getState().columns as any)[propName] ?? []
    if (!values.length) {
        all.forEach((item: Partial<ComponentOptions>) => {
            if (item.component) {
                let value: string = (item.component as any)[propName]
                let index = values.findIndex((item: string) => item === `${value}`)
                if (index === -1 && value !== undefined)
                    values.push(`${value}`)
            }
        })
        values.unshift(AppEnum.ALL)
        componentStorage.dispatch(setColumns([propName, values]))
    }
    return values
} 

export default componentTypeFilters