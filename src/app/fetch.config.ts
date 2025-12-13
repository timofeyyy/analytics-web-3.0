import { Observable } from "rxjs";
import { ApiService } from "../services/api.services";
import { AppEnum } from "../utils/enum/app.enum";
import ManufacturerNameFilters from "../utils/fnc1/filters/manufacturer-name";
import componentKindFilters from "../utils/fnc1/filters/component-kind";





const sortObj = {
  'ManufacturerName': (props: any, all: any[]) => ManufacturerNameFilters(props, all),
  'RuComponentKind': (props: any, all: any[]) => componentKindFilters(props, all)
}

export const sortObjMap: Map<string, any> = new Map(Object.entries(sortObj));

const prioritySchema = {
  "Микросхема": [
    "ConsumptionCurrent",
    "Qualication",
    // "ManufacturerName",
    "SamplingTime",
    "MinOperatingTemperature",
    "Frequency",
    "MinVoltage"
  ],
  "Диод": [
    "MinOperatingTemperature",
    "QualicationЕС",
    // "ManufacturerName",
    "RadiationResistance",
    "MaxOperatingTemperature",
    // "maxPermissibleDCCollectorCurrent",
    "MaxPermissibleDCVoltage",
    "Package",
  ],
  "Транзистор": [
    "MaxOperatingTemperature",
    "RadiationResistance",
    "QualicationЕС",
    "MaxPermissibleDCVoltage",
    "MinOperatingTemperature",
    // "maxiPermissibleDirectCurrent",
    // "RuComponentKind",
    // "ManufacturerName",
    "Package"
  ],
  "Конденсатор": [
    "QualicationSG",
    "MinCapacity",
    "MaxCapacity",
    "AcceptableСapacityReduction",
    "AcceptableCapacityIncrease",
    // "ManufacturerName",
    "OutputType",
    "MaxOperatingTemperature",
    "MaxVoltage",
    // "RuComponentKind"

  ],
  "Резистор": [
    "PowerRating",
    "MinRatedResistance",
    "MaxRatedResistance",
    // "ManufacturerName",
    "CurrentLimit",
    "ResistanceTolerance",
    "MaxOperatingTemperature",
    "MaxVoltage"
  ]
}


//microchips 
// 2800
// 7.К11- 60 МэВ см2/мг
// АО НТЦ Модуль
// -1.7976931348623157e+308
// -60
// 200
// 3
// initComponentSchema
export const prioritySchemaMap: Map<string, string[]> = new Map(Object.entries(prioritySchema));
// export const prioritySchemaWrapperMap: Map<string, string> = new Map(Object.entries(prioritySchemaWrapper));
// export const prioritySchemaWrapper2Map: Map<string, string> = new Map(Object.entries(prioritySchemaWrapper2));
// export const chartNamesMap: Map<string, string> = new Map(Object.entries(chartNames));
// export const propsMap: Map<string, any> = new Map(Object.entries(props));
// export const propsNamesMap: Map<string, ComponentProp[]> = new Map(Object.entries(propsNames));



 