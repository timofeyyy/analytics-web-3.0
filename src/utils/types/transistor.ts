export interface Transistor {
    id: number,
    docID: number,
    componentName: string,
    ruComponentKind: string,
    enComponentKind: string,
    ruComponentType: string,
    enComponentType: string,
    manufacturerName: string,

    maxPermissibleDCVoltage: number,
    minOperatingTemperature: number,
    maxOperatingTemperature: number,
    maxPermissibleDCCollectorCurrent: number,
    radiationResistance: number,

    
    radiationResistanceI: string,
    qualicationSG: string,
    qualicationЕС: string,
    package: string,
    remark1: string,
    remark2: string
}
