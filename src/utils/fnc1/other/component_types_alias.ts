import { filter, map, Observable, switchMap } from "rxjs"
import { componentStorage, init } from "../../redux/component"

const getComponentTypeAlias = () => {
    // new Observable().pipe(map(() => {
    //     if (!componentStorage.getState().componentTypes) {
    //         componentStorage.dispatch(init())
    //     }
    // })).subscribe(() => {

    // })

    // return
}

export { getComponentTypeAlias }