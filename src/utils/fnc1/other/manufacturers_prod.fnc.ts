import { Manufacturer, ComponentLabel } from "../../types/app";
import { ChartOptions } from "../../types/chart";



const getManufacturersProd = (data: any): Partial<Manufacturer>[] => {
   
    let records: Partial<Manufacturer>[] = []

    if (Array.isArray(data)) {
        data.forEach((obj: ComponentLabel) => {
            let recordIndex: number = records.findIndex(
                (record: Partial<Manufacturer>) => record.manufacturerName === obj.manufacturerName
            )

            if(recordIndex === -1) {
                records.push({
                    manufacturerName: obj.manufacturerName,
                    prodSummary: 1
                })
            }
            else {
                (records[recordIndex].prodSummary as number) +=1
            }
        });
    }

    return records;
}

export default getManufacturersProd