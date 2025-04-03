export interface Capacitor {
    id: number,
    docID: number,
    componentName: string,
    ruComponentKind: string,
    enComponentKind: string,
    ruComponentType: string,
    enComponentType: string,
    manufacturerName: string,

    outputType: string,
    minVoltage: number,
    maxVoltage: number,
    maxCapacity: number,
    minCapacity: number,

    
    minOperatingTemperature: number,
    maxOperatingTemperature: number,
    acceptableCapacityIncrease: number,
    acceptableСapacityReduction: number,
    qualicationSG: string,
    qualicationЕС: string,
    remark1: string,
    remark2: string
}
