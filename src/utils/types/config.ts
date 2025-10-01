import { ComponentTypeRuEnum } from "../enum/app.enum"

export interface Config {
    api: {
        url: string
    },
    chart: ChartConfig[],
    // countries: ImageName[],
    // components: ImageName[]
}


export interface ChartConfig {
    name: string,
    alias: string,
    routes: ChartRoute[]
}


export interface ChartRoute {
    alias: string,
    route: string
}


// export interface ImageName {
//     nameRu: string | ComponentTypeRuEnum, 
//     image: string
// }