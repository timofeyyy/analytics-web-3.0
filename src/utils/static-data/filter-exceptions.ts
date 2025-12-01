const exceptions = [
    'ruComponentType',
    'enComponentType',
    'ruComponentKind',
    'enComponentKind',
    'enTechnologyName',
    'manufacturerName',
    'componentName',
    'remark1',
    'remark2',
    'insertion',
    'id'
]

const isException = (column: string): boolean => {
    let value = exceptions.find((val) => val.toLowerCase() == column.toLowerCase())
    return value != null
}
export { isException }