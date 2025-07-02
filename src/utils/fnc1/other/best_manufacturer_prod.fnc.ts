const getBestManufacturer = (data: any, ruComponentType: string): any => {

    var record = {
        manufacturerName: 'none',
        prodProcent: 0,
        prodSummary: 0
    }

    if (Array.isArray(data)) {
        let summary: number = 0
        let tmp: any = {}
        data.forEach((obj: any) => {
            if (obj.ruComponentType === ruComponentType) {
                summary++
                if (tmp[obj.manufacturerName] === undefined) {
                    tmp[obj.manufacturerName] = 0
                }
                tmp[obj.manufacturerName] += 1
            }
        });
        for (const key in tmp) {
            let value = tmp[key]
            let proc: number = Number((value * 100 / summary).toFixed(1))
            if (proc > record.prodProcent) {
                record.manufacturerName = key
                record.prodProcent = proc
                record.prodSummary = value
            }
        }

    }
    return record;
}

export default getBestManufacturer