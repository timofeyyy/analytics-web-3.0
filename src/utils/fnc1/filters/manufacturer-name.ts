import { AppEnum } from "../../enum/app.enum"

const manufacturerNameFilters = (props: any, all: any[]): string[] => {
    let ruComponentType: string | undefined = props.get('ruComponentType')?.currentValue ?? AppEnum.ALL
    // let ruComponentKind: string | undefined = props.get('ruComponentKind')?.currentValue ?? AppEnum.ALL
    let values: string[] = [AppEnum.ALL]
    all.forEach((item: any) => {
        if (
            item &&
            ruComponentType === item.ruComponentType || ruComponentType === AppEnum.ALL
            // && (ruComponentKind === item!.ruComponentKind || ruComponentKind == AppEnum.ALL)
        ) {
            let value: string = item!.manufacturerName
            let index = values.findIndex((item: string) => item === value)
            if (index === -1 && value !== undefined)
                values.push(value)
        }
    })
    return values
}

export default manufacturerNameFilters