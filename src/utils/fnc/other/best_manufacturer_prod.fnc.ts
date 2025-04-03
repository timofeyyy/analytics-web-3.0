import { AppEnum, ComponentTypeRuEnum } from "../../enum/app.enum";
import { Manufacturer, OptionsApi } from "../../types/app";
import { ChartOptions } from "../../types/chart";
import { BitDepthValue } from "../../types/microchip";



const getBestManufacturer = (data: any, componentType: string): Manufacturer => {
 
    var record: Manufacturer = {
        manufacturerName: 'none',
        prodProcent: 0,
        prodSummary: 0
    }
    
    if (Array.isArray(data)) {

        let summary: number = 0
        let tmp: any = {}
        

        data.forEach((obj: OptionsApi) => {
            if (obj.ruComponentType === componentType) {
                summary++
                if (tmp[obj.manufacturerName] === undefined) {
                    tmp[obj.manufacturerName] = 0 
                }
                tmp[obj.manufacturerName]+=1
            }
        });

        for (const key in tmp) {
            let value = tmp[key]
            if(value> record.prodProcent) {
                record.manufacturerName = key
                record.prodProcent = Number((value * 100/summary).toFixed(1)) 
                record.prodSummary = value
            }
        }

    }

    return record;
}

export default getBestManufacturer