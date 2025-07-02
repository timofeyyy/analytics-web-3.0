const getManufacturersProd = (data: any): any[] => {

    let records: any[] = []
    if (Array.isArray(data)) {
        data.forEach((obj: any) => {
            if (obj.manufacturerName) {
                let recordIndex: number = records.findIndex(
                    (record: any) => record.manufacturerName === obj.manufacturerName
                )
                if (recordIndex === -1) {
                    records.push({
                        manufacturerName: obj.manufacturerName,
                        prodSummary: 1
                    })
                }
                else {
                    (records[recordIndex].prodSummary as number) += 1
                }
            }
        });
    }

    return records;
}

export default getManufacturersProd