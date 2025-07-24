const getParameterValueCountStat = (data: any, key: string): any[] => {

    let records: any[] = []
    if (Array.isArray(data)) {
        data.forEach((obj: any) => {
            if (obj[key] !== undefined) {
                let value = obj[key] ? obj[key] : 'Не указано' 
                let recordIndex: number = records.findIndex(
                    (record: any) => record.value === value
                )
                if (recordIndex === -1) {
                    records.push({
                        value: value,
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

export default getParameterValueCountStat