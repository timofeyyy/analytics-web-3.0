export const columnsMax = [
  "maxPermissibleAverageDirectCurrent",
  "maxiPermissibleDirectCurrent",
  "maxPermissibleDCVoltage",
  "maxPermissibleDCCollectorCurrent",
  "maxVoltage",
  "maxOperatingTemperature",
  "maxCapacity",
  "maxRatedResistance"
]

export const columnsMin = [
  "minCapacity",
  "minOperatingTemperature",
  "minVoltage",
  "minRatedResistance"
]

const existInColumnsMax = (column: string): boolean => {
    return columnsMax.findIndex((value) => value == column) !== -1
}

const existInColumnsMin = (column: string): boolean => {
    return columnsMin.findIndex((value) => value == column) !== -1
}

export { existInColumnsMax, existInColumnsMin } 