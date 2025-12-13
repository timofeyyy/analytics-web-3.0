export interface Resistor {
    id: number,
    docID: number,
    componentName: string,
    RuComponentKind: string,
    EnComponentKind: string,
    RuComponentType: string,
    EnComponentType: string,
    ManufacturerName: string,
    
    powerRating: number, 
    minVoltage: number,
    maxVoltage: number,
    resistanceTolerance: number,
    minOperatingTemperature: number,
    maxOperatingTemperature: number,
    minRatedResistance: number, 
    maxRatedResistance: number
    currentLimit: number
    qualicationSG: string,
    qualicationЕС: string,
    package: string,
    remark1: string,
    remark2: string
} 