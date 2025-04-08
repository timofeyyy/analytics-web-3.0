import { AppEnum } from "../../enum/app.enum"
import { Option, Test } from "../../types/app"

const manufacturerNameFilters = (props: any, all: Test[]): string[] => {
    let ruComponentType: string | undefined = props['ruComponentType']?.currentvalue
    let ruComponentKind: string | undefined = props['ruComponentKind']?.currentvalue
    let values: string[] = [AppEnum.ALL]
    all.forEach((item: Test) => {
        if (
            ruComponentType === item.component.ruComponentType || ruComponentType === AppEnum.ALL
            && (ruComponentKind === item.component.ruComponentKind || ruComponentKind == AppEnum.ALL)
        ) {
            let value: string = item.component.manufacturerName
            let index = values.findIndex((item: string) => item === value)
            if (index === -1 && value !== undefined)
                values.push(value)
        }
    })

    return values
}

export default manufacturerNameFilters