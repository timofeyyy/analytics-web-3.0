import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService1 } from '../../services/api.services1';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { observableApiMap } from '../../assets/fetch.config';
import { forkJoin, map } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-item-info-template',
  imports: [HttpClientModule],
  templateUrl: './item_info_template.component.html',
  providers: [ApiService1],
  styleUrl: './item_info_template.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ItemInfoTemplateComponent implements OnInit {
  layout: any
  constructor(
    private api: ApiService1,
    private router: Router,
    private route: ActivatedRoute,
    private santizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    const query = new Map(Object.entries((this.route.snapshot.queryParamMap as any).params));
    const getObservable = observableApiMap.get(query.get("ruComponentType") as string) 
    if (getObservable) {
      forkJoin([
        this.api.getAlias(),
        getObservable(this.api, (query as unknown) as Map<string, string>)
      ]).subscribe((res: any[]) => {
        console.log(res)
        let markup = ''
        const obj = res[1][0]
        const allias = res[0]
        for (const key in obj) {
          markup += `<p>${allias[key]}: ${obj[key]}</p>`
        }
        console.log(markup, obj)
        this.layout = this.santizer.bypassSecurityTrustHtml(markup)
      })
    }
    // this.route.paramMap.subscribe(params => {

    //   // console.log(this.params, this.params.get("componentName"))
    // })
  }

}
