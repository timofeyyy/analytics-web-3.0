const exceptions = [
    'RuComponentType',
    'EnComponentType',
    'RuComponentKind',
    'EnComponentKind',
    'EnTechnologyName',
    'ManufacturerName',
    'ComponentName',
    'Remark1',
    'Remark2',
    'InsertionDate',
    'ID',
    'Kind',
    'Technology',
    'SpecificationDoc', 
]

const isException = (column: string): boolean => {
    let value = exceptions.find((val) => val.toLowerCase() == column.toLowerCase())
    return value != null
}
export { isException }