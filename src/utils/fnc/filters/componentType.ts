import { AppEnum } from "../../enum/app.enum"
import { Option, Test } from "../../types/app"

const componentTypeFilters = (props: any, all: Test[]) : string[] => {
    let values: string [] = [AppEnum.ALL]
    all.forEach((item: Test) => {
        let value: string = item.component.ruComponentType
        let index = values.findIndex((item: string) => item === value)
        if (index === -1 && value !== undefined)
            values.push(value)

    })
    return values
}

export default componentTypeFilters