import { AppEnum } from "../../enum/app.enum"
import { Option, Test } from "../../types/app"

const componentKindFilters = (props: any, all: Test[]): string[] => {

    let ruComponentType: string | undefined = props['ruComponentType']?.currentvalue
    console.log(ruComponentType)
    let values: string[] = [AppEnum.ALL]
    all.forEach((item: Test) => {
        if (ruComponentType === item.component.ruComponentType || ruComponentType === AppEnum.ALL) {
            let value: string = item.component.ruComponentKind
            let index = values.findIndex((item: string) => item === value)
            if (index === -1 && value !== undefined)
                values.push(value)
        }

    })

    return values
}

export default componentKindFilters