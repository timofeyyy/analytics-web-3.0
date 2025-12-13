import { AppEnum } from "../../enum/app.enum"

const ManufacturerNameFilters = (props: any, all: any[]): string[] => {
    let RuComponentType: string | undefined = props.get('RuComponentType')?.currentValue ?? AppEnum.ALL
    // // console.log(RuComponentType)
    // let RuComponentKind: string | undefined = props.get('RuComponentKind')?.currentValue ?? AppEnum.ALL
    let values: string[] = [AppEnum.ALL]
    all.forEach((item: any) => {
        // if (
        //     RuComponentType || RuComponentType === AppEnum.ALL
        //     // && (RuComponentKind === item!.RuComponentKind || RuComponentKind == AppEnum.ALL)
        // ) {
            let value: string = item!.ManufacturerName
            let index = values.findIndex((item: string) => item === value)
            if (index === -1 && value !== undefined)
                values.push(value)
        // }
    })
    // // console.log(values)
    return values
}

export default ManufacturerNameFilters