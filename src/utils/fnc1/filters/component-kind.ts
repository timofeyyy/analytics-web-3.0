import { AppEnum } from "../../enum/app.enum"

const componentKindFilters = (props: any, all: any[]): string[] => {

    let RuComponentType: string | undefined = props.get('RuComponentType')?.currentValue ?? AppEnum.ALL
    let ManufacturerName: string | undefined = props.get('ManufacturerName')?.currentValue ?? AppEnum.ALL

    let values: string[] = [AppEnum.ALL]
    all.forEach((item: any) => {
        if (
            item &&
            RuComponentType === item.RuComponentType || RuComponentType === AppEnum.ALL
            && (ManufacturerName === item!.ManufacturerName || ManufacturerName == AppEnum.ALL)
        ) {
            let value: string = item!.RuComponentKind
            let index = values.findIndex((item: string) => item === value)
            if (index === -1 && value !== undefined)
                values.push(value)
        }

    })
    return values
}

export default componentKindFilters