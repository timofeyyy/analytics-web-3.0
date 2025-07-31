import { AppEnum } from "../../enum/app.enum"
import { ComponentOptions } from "../../types/app"
import {  setColumns, store } from "../../redux/storage"
   
const componentTypeFilters = (propName: string, all: Partial<ComponentOptions>[]): string[] => {
    let values: string[] = (store.getState().columns as any)[propName] ?? []

    if (!values.length) {
        // console.log(propName)
        all.forEach((item: Partial<ComponentOptions>) => {
            if (item.component) {
                let value: string = (item.component as any)[propName]
                let index = values.findIndex((item: string) => item === `${value}`)
                if (index === -1 && value !== undefined)
                    values.push(`${value}`)
            }
        })
        values.unshift(AppEnum.ALL)
        store.dispatch(setColumns([propName, values]))
    }


    return values
}

export default componentTypeFilters