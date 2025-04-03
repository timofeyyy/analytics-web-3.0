export interface Config {
    api: {
        url: string
    },
    chart: ChartConfig[],
    countries: ImageName[],
    components: ImageName[]
}


export interface ChartConfig {
    name: string,
    allias: string,
    routes: ChartRoute[]
}


export interface ChartRoute {
    allias: string,
    route: string
}


export interface ImageName {
    nameRu: string, 
    image: string
}