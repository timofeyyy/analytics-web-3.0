const getMinMax = (map: Map<string, number>): { min: Map<string, number>, max: Map<string, number> } => {
    const res = { min: new Map(), max: new Map() }
    const sortedMapEntriesArr = [...map.entries()]
    for (let i = 0; i < sortedMapEntriesArr.length; i++) {
        if (!res.max.size) {
            res.max.set(sortedMapEntriesArr[i][0], sortedMapEntriesArr[i][1])
            continue
        }
        if (sortedMapEntriesArr[0][1] === sortedMapEntriesArr[i][1]) {
            res.max.set(sortedMapEntriesArr[i][0], sortedMapEntriesArr[i][1])
        }
        else {
            break
        }
    }
    for (let i = sortedMapEntriesArr.length - 1, last = sortedMapEntriesArr.length - 1; i > 0 ; i--) {
        if (!res.min.size) {
            res.min.set(sortedMapEntriesArr[i][0], sortedMapEntriesArr[i][1])
            continue
        }
        if (sortedMapEntriesArr[last][1] === sortedMapEntriesArr[i][1]) {
            res.min.set(sortedMapEntriesArr[i][0], sortedMapEntriesArr[i][1])
        }
    }
    // console.log(res)
    return res
}

export default getMinMax