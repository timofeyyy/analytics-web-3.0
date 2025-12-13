const getBestManufacturer = (data: any, RuComponentType: string): any => {

    var record = {
        ManufacturerName: 'none',
        prodProcent: 0,
        prodSummary: 0
    }

    if (Array.isArray(data)) {
        let summary: number = 0
        let tmp: any = {}
        data.forEach((obj: any) => {
            if (obj.RuComponentType === RuComponentType) {
                summary++
                if (tmp[obj.ManufacturerName] === undefined) {
                    tmp[obj.ManufacturerName] = 0
                }
                tmp[obj.ManufacturerName] += 1
            }
        });
        for (const key in tmp) {
            let value = tmp[key]
            let proc: number = Number((value * 100 / summary).toFixed(1))
            if (proc > record.prodProcent) {
                record.ManufacturerName = key
                record.prodProcent = proc
                record.prodSummary = value
            }
        }

    }
    return record;
}

export default getBestManufacturer