import { columnsMin } from "../../../app/fetch.config"

const existInColumnsMin = (column: string): boolean => {
    return columnsMin.findIndex((value) => value == column) !== -1
}

export default existInColumnsMin