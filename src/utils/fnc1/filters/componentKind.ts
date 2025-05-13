import { AppEnum } from "../../enum/app.enum"
import { ComponentOptions } from "../../types/app"

const componentKindFilters = (props: any, all: ComponentOptions[]): string[] => {

    let ruComponentType: string | undefined = props['ruComponentType']?.currentvalue
    // console.log(ruComponentType)
    let values: string[] = [AppEnum.ALL]
    all.forEach((item: ComponentOptions) => {
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