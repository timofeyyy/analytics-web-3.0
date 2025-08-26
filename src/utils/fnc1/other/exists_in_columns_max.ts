import { columnsMax } from "../../../app/fetch.config"

const existInColumnsMax = (column: string): boolean => {
    return columnsMax.findIndex((value) => value == column) !== -1
}

export default existInColumnsMax