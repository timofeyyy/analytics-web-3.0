const getManufacturer = (arr: []): string | undefined => {
    let res: string[] = []
    for (const element of arr) {
        if (res.findIndex((val) => val == element['manufacturerName']) === -1) {
            res.push(element['manufacturerName'])
        }
        if (res.length > 1) {
            return undefined
        }
    }
    return res[0]
}
export default getManufacturer
