import { Observable } from "rxjs"
import { ApiService } from "../../services/api.services"

interface ObservableStorage {
  [chart: string]: (injector: ApiService, data: Map<string, any>) => Observable<any> | null
}

const observableApi: ObservableStorage = {
  // "components1": (injector: ApiService, data: Map<string, any>) => injector.getComponentsApiPreview(data),
  "components": (injector: ApiService, data: Map<string, any>) => injector.getComponentsAll(data),
  // "bitDepthValue": (injector: ApiService, data: Map<string, any>) => injector.getBitDepthValue(data),
  // "Микросхема": (injector: ApiService, data: Map<string, any>) => injector.getMicrochips(data),
  // "Транзистор": (injector: ApiService, data: Map<string, any>) => injector.getTransistors(data),
  // "Резистор": (injector: ApiService, data: Map<string, any>) => injector.getResistors(data),
  // "Конденсатор": (injector: ApiService, data: Map<string, any>) => injector.getCapacitors(data),
  // "Диод": (injector: ApiService, data: Map<string, any>) => injector.getDiods(data),
}

export const observableApiMap: Map<string, (injector: ApiService, data: Map<string, any>) => Observable<any> | null> = new Map(Object.entries(observableApi));
