import { AppEnum } from "../../enum/app.enum"
import { ComponentOptions } from "../../types/app"

const componentTypeFilters = (props: any, all: Partial<ComponentOptions>[]): string[] => {
    let values: string[] = [AppEnum.ALL]
    all.forEach((item: Partial<ComponentOptions>) => {
        if (item.component) {
            let value: string = item.component!.ruComponentType
            let index = values.findIndex((item: string) => item === value)
            if (index === -1 && value !== undefined)
                values.push(value)
        }
    })
    return values
}

export default componentTypeFilters