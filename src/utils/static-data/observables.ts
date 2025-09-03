import { Observable } from "rxjs"
import { ApiService1 } from "../../services/api.services1"

interface ObservableStorage {
  [chart: string]: (injector: ApiService1, data: Map<string, any>) => Observable<any> | null
}

const observableApi: ObservableStorage = {
  // "components1": (injector: ApiService1, data: Map<string, any>) => injector.getComponentsApiPreview(data),
  "components": (injector: ApiService1, data: Map<string, any>) => injector.getComponentsApiAll(data),
  // "bitDepthValue": (injector: ApiService1, data: Map<string, any>) => injector.getBitDepthValue(data),
  "Микросхема": (injector: ApiService1, data: Map<string, any>) => injector.getMicrochips(data),
  "Транзистор": (injector: ApiService1, data: Map<string, any>) => injector.getTransistors(data),
  "Резистор": (injector: ApiService1, data: Map<string, any>) => injector.getResistors(data),
  "Конденсатор": (injector: ApiService1, data: Map<string, any>) => injector.getCapacitors(data),
  "Диод": (injector: ApiService1, data: Map<string, any>) => injector.getDiods(data),
}

export const observableApiMap: Map<string, (injector: ApiService1, data: Map<string, any>) => Observable<any> | null> = new Map(Object.entries(observableApi));
