export interface Microchip {
    id: number,
    docID: number,
    componentName: string,
    ruComponentKind: string,
    enComponentKind: string,
    ruComponentType: string,
    enComponentType: string,
    enTechnologyName: string,
    ruTechnologyName: string,
    manufacturerName: string,
    interfaces: string,
    minVoltage: number,
    maxVoltage: number,
    frequency: number,
    bitDepthValue: number,
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
    manufacturerName: string,
    bitDepthValue: string,
    componentName: string,
    ruComponentKind: string,
}
