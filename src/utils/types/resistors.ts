export interface Resistor {
    id: number,
    docID: number,
    componentName: string,
    ruComponentKind: string,
    enComponentKind: string,
    ruComponentType: string,
    enComponentType: string,
    manufacturerName: string,
    powerRating: number, 
    minVoltage: number,
    maxVoltage: number,
    resistanceTolerance: number,
    minOperatingTemperature: number,
    maxOperatingTemperature: number,
    minRatedResistance: number,
    maxRatedResistance: number
    qualicationSG: string,
    qualicationЕС: string,
    package: string,
    remark1: string,
    remark2: string
} 