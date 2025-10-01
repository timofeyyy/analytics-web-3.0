import { Observable } from "rxjs";
import { ApiService } from "../services/api.services1";
import { AppEnum } from "../utils/enum/app.enum";
import manufacturerNameFilters from "../utils/fnc1/filters/manufacturer-name";
import componentKindFilters from "../utils/fnc1/filters/component-kind";





// const sortObj = {
//   'manufacturerName': (props: any, all: ComponentOptions[]) => manufacturerNameFilters(props, all),
//   'ruComponentKind': (props: any, all: ComponentOptions[]) => componentKindFilters(props, all)
// }

// export const sortObjMap: Map<string, any> = new Map(Object.entries(sortObj));

export const props = {
  'manufacturerName': {
    currentValue: AppEnum.ALL,
    input: false,
    sort: (props: any, all: any[]) => manufacturerNameFilters(props, all)
  },
  'ruComponentKind': {
    currentValue: AppEnum.ALL,
    input: false,
    sort: (props: any, all: any[]) => componentKindFilters(props, all)
  },
  'bitDepthValue': {
    currentValue: AppEnum.ALL,
    input: false
  },
  'ruTechnologyName': {
    currentValue: AppEnum.ALL,
    input: false
  },
  'frequency': {
    currentValue: "",
    input: true
  },
  'minOperatingTemperature': {
    currentValue: "",
    input: true
  },
  'maxOperatingTemperature': {
    currentValue: "",
    input: true
  },
  'radiationResistance': {
    currentValue: "",
    input: true
  },
  'radiationResistanceI': {
    currentValue: "",
    input: true
  },
  'samplingTime': {
    currentValue: "",
    input: true
  },
  'minVoltage': {
    currentValue: "",
    input: true
  },
  'maxVoltage': {
    currentValue: "",
    input: true
  },
  'outputType': {
    currentValue: AppEnum.ALL,
    input: false
  },
  'ruComponentType': {
    currentValue: AppEnum.ALL,
    input: false
  },
  'enComponentType': {
    currentValue: AppEnum.ALL,
    input: false
  },
  'maxPermissibleAverageDirectCurrent': {
    currentValue: "",
    input: true
  },
  'maxiPermissibleDirectCurrent': {
    currentValue: "",
    input: true
  },
  'package': {
    currentValue: AppEnum.ALL,
    input: false
  },
  'maxPermissibleDCVoltage': {
    currentValue: "",
    input: true
  },
  'maxPermissibleDCCollectorCurrent': {
    currentValue: "",
    input: true
  },
  'qualication': {
    currentValue: "",
    input: true
  },
  'interfaces': {
    currentValue: "",
    input: true
  },
  'remark2': {
    currentValue: "",
    input: true
  },
  'remark1': {
    currentValue: "",
    input: true
  },
  'qualicationЕС': {
    currentValue: AppEnum.ALL,
    input: false
  },
  'qualicationSG': {
    currentValue: AppEnum.ALL,
    input: false
  },
  'minCapacity': {
    currentValue: "",
    input: true
  },
  'memoryFormat': {
    currentValue: AppEnum.ALL,
    input: false
  },
  'maxCapacity': {
    currentValue: "",
    input: true
  },
  'consumptionCurrent': {
    currentValue: "",
    input: true
  },
  'acceptableСapacityReduction': {
    currentValue: "",
    input: true
  },
  'acceptableCapacityIncrease': {
    currentValue: "",
    input: true
  },
  'powerRating': {
    currentValue: "",
    input: true
  },
  'currentLimit': {
    currentValue: "",
    input: true
  },
  'maxRatedResistance': {
    currentValue: "",
    input: true
  },
  'minRatedResistance': {
    currentValue: "",
    input: true
  },
  'resistanceTolerance': {
    currentValue: "",
    input: true
  }
}




const prioritySchema = {
  "Микросхема": [
    "consumptionCurrent",
    "qualication",
    "manufacturerName",
    "samplingTime",
    "minOperatingTemperature",
    "frequency",
    "minVoltage"
  ],
  "Диод": [
    "minOperatingTemperature",
    "qualicationЕС",
    "manufacturerName",
    "radiationResistance",
    "maxOperatingTemperature",
    "maxPermissibleDCCollectorCurrent",
    "maxPermissibleDCVoltage",
    "package",
  ],
  "Транзистор": [
    "maxOperatingTemperature",
    "radiationResistance",
    "qualicationЕС",
    "maxPermissibleDCVoltage",
    "minOperatingTemperature",
    "maxiPermissibleDirectCurrent",
    "ruComponentKind",
    "manufacturerName",
    "package"
  ],
  "Конденсатор": [
    "qualicationSG",
    "minCapacity",
    "maxCapacity",
    "acceptableСapacityReduction",
    "acceptableCapacityIncrease",
    "manufacturerName",
    "outputType",
    "maxOperatingTemperature",
    "maxVoltage",
    "ruComponentKind"

  ],
  "Резистор": [
    "powerRating",
    "minRatedResistance",
    "maxRatedResistance",
    "manufacturerName",
    "currentLimit",
    "resistanceTolerance",
    "maxOperatingTemperature",
    "maxVoltage"
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
export const propsMap: Map<string, any> = new Map(Object.entries(props));
// export const propsNamesMap: Map<string, ComponentProp[]> = new Map(Object.entries(propsNames));



 