import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AppEnum } from "../utils/enum/app.enum";

@Injectable()
export class QuerySettingsService {

    constructor(
        private router: Router,
        private route: ActivatedRoute,
    ) { }

    isFullView(): boolean {
        const query: Map<string, string> = new Map(Object.entries((this.route.snapshot.queryParamMap as any).params))
        const params = query.get("params")
        let exists
        if (params) {
            const vals = params.split(";")
            exists = vals.find((val) => val == "full-view")
        }
        return Boolean(exists)
    }

    isPriorityWindow(): boolean {
        const query: Map<string, string> = new Map(Object.entries((this.route.snapshot.queryParamMap as any).params))
        const params = query.get("params")
        let exists
        if (params) {
            const vals = params.split(";")
            exists = vals.find((val) => val == "priorityWindow")
            //priorityWindow
        }
        return Boolean(exists)
    }

    redirectSelectionPage(): Promise<any> {
        const entry = JSON.parse(localStorage.getItem('selection')!)
        return (entry && Array.isArray(entry) && entry.length == 2) ? this.router.navigate(entry[0], entry[1]) : new Promise((res, rej) => res(undefined))
    }

    setQuery(query: Map<string, string>, queryParamsHandlingState: 'replace' | 'merge'): Promise<Map<string, string>> {
        const querysearchBuffer: Map<string, string | null> = query
        if (querysearchBuffer.get('ruComponentType') === AppEnum.ALL) {
          querysearchBuffer.set('ruComponentType', null)
        }
        return this.router.navigate([], {
          relativeTo: this.route,
          queryParams: Object.fromEntries(querysearchBuffer),
          queryParamsHandling: queryParamsHandlingState,
          skipLocationChange: false,
        }).then(() => {
          if (querysearchBuffer.get('ruComponentType') === null) {
            querysearchBuffer.delete('ruComponentType')
          }
          return querysearchBuffer as Map<string, string>
        });
      }
}