import { AppEnum } from "../../enum/app.enum"

const manufacturerNameFilters = (props: any, all: any[]): string[] => {
    let ruComponentType: string | undefined = props.get('ruComponentType')?.currentValue ?? AppEnum.ALL
    // // console.log(ruComponentType)
    // let ruComponentKind: string | undefined = props.get('ruComponentKind')?.currentValue ?? AppEnum.ALL
    let values: string[] = [AppEnum.ALL]
    all.forEach((item: any) => {
        // if (
        //     ruComponentType || ruComponentType === AppEnum.ALL
        //     // && (ruComponentKind === item!.ruComponentKind || ruComponentKind == AppEnum.ALL)
        // ) {
            let value: string = item!.manufacturerName
            let index = values.findIndex((item: string) => item === value)
            if (index === -1 && value !== undefined)
                values.push(value)
        // }
    })
    // // console.log(values)
    return values
}

export default manufacturerNameFilters