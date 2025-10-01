import { AppEnum } from "../../enum/app.enum"

const componentKindFilters = (props: any, all: any[]): string[] => {

    let ruComponentType: string | undefined = props.get('ruComponentType')?.currentValue ?? AppEnum.ALL
    let manufacturerName: string | undefined = props.get('manufacturerName')?.currentValue ?? AppEnum.ALL

    let values: string[] = [AppEnum.ALL]
    all.forEach((item: any) => {
        if (
            item &&
            ruComponentType === item.ruComponentType || ruComponentType === AppEnum.ALL
            && (manufacturerName === item!.manufacturerName || manufacturerName == AppEnum.ALL)
        ) {
            let value: string = item!.ruComponentKind
            let index = values.findIndex((item: string) => item === value)
            if (index === -1 && value !== undefined)
                values.push(value)
        }

    })
    return values
}

export default componentKindFilters