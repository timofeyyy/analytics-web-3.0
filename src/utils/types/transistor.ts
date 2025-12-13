export interface Transistor {
    id: number,
    docID: number,
    componentName: string,
    RuComponentKind: string,
    EnComponentKind: string,
    RuComponentType: string,
    EnComponentType: string,
    ManufacturerName: string,

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
