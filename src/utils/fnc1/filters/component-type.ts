import { AppEnum } from "../../enum/app.enum"
import {  componentStorage, setColumns } from "../../redux/component"
   
const componentTypeFilters = (propName: string, all: any[]): string[] => {
    let values: string[] = (componentStorage.getState().columns as any)[propName] ?? []
    if (!values.length) {
        all.forEach((item: any) => {
            if (item) {
                let value: string = (item as any)[propName]
                let index = values.findIndex((item: string) => item === (value ? `${value}` : 'null'))
                if (index === -1 && value !== undefined)
                    values.push(value ? `${value}` : 'null')
            }
        })
        values.unshift(AppEnum.ALL)
        componentStorage.dispatch(setColumns([propName, values]))
    }
    return values
} 

export default componentTypeFilters