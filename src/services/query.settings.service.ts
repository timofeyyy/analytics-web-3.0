import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

@Injectable()
export class QueryPageSettings {

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

    isPrExists(): boolean {
        const query: Map<string, string> = new Map(Object.entries((this.route.snapshot.queryParamMap as any).params))
        const params = query.get("params")
        let exists
        if (params) {
            const vals = params.split(";")
            exists = vals.find((val) => val == "pr")
        }
        return Boolean(exists)
    }

    redirectSelectionPage(): Promise<any> {
        const entry = JSON.parse(localStorage.getItem('selection')!)
        return (entry && Array.isArray(entry) && entry.length == 2) ? this.router.navigate(entry[0], entry[1]) : new Promise((res, rej) => res(undefined))
    }
}