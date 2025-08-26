import { AppEnum } from "../../enum/app.enum"
import { ComponentOptions } from "../../types/app"

const manufacturerNameFilters = (props: any, all: Partial<ComponentOptions>[]): string[] => {
    let ruComponentType: string | undefined = props.get('ruComponentType')?.currentValue ?? AppEnum.ALL
    // let ruComponentKind: string | undefined = props.get('ruComponentKind')?.currentValue ?? AppEnum.ALL
    let values: string[] = [AppEnum.ALL]
    all.forEach((item: Partial<ComponentOptions>) => {
        if (
            item.component &&
            ruComponentType === item.component.ruComponentType || ruComponentType === AppEnum.ALL
            // && (ruComponentKind === item.component!.ruComponentKind || ruComponentKind == AppEnum.ALL)
        ) {
            let value: string = item.component!.manufacturerName
            let index = values.findIndex((item: string) => item === value)
            if (index === -1 && value !== undefined)
                values.push(value)
        }
    })
    return values
}

export default manufacturerNameFilters