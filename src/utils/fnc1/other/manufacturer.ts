const getManufacturer = (arr: []): string | undefined => {
    let res: string[] = []
    for (const element of arr) {
        if (res.findIndex((val) => val == element['ManufacturerName']) === -1) {
            res.push(element['ManufacturerName'])
        }
        if (res.length > 1) {
            return undefined
        }
    }
    return res[0]
}
export default getManufacturer