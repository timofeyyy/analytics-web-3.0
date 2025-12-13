export interface Microchip {
    id: number,
    docID: number,
    componentName: string,
    RuComponentKind: string,
    EnComponentKind: string,
    RuComponentType: string,
    EnComponentType: string,
    enTechnologyName: string,
    ruTechnologyName: string,
    ManufacturerName: string,
    interfaces: string,
    minVoltage: number,
    maxVoltage: number,
    frequency: number,
    bitDepthValue: string,
    consumptionCurrent: number,
    minOperatingTemperature: number,
    maxOperatingTemperature: number,
    radiationResistance: number,
    radiationResistanceI: string,
    memoryFormat: string,
    samplingTime: number,
    qualication: number,
    remark1: string
}


export interface BitDepthValue {
    ManufacturerName: string,
    bitDepthValue: string,
    componentName: string,
    RuComponentKind: string,
}
