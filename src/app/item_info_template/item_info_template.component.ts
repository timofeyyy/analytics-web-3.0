import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService1 } from '../../services/api.services1';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { observableApiMap, prioritySchemaWrapper2Map } from '../fetch.config';
import { forkJoin, map } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigatorComponent } from "../components/navigator/navigator.component";
import { LoaderComponent } from "../components/loader/loader.component";
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-item-info-template',
  imports: [HttpClientModule, NavigatorComponent, LoaderComponent, NgStyle],
  templateUrl: './item_info_template.component.html',
  providers: [ApiService1],
  styleUrl: './item_info_template.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ItemInfoTemplateComponent implements OnInit {
  header: any
  body: any
  loader!: boolean
  constructor(
    private api: ApiService1,
    private router: Router,
    private route: ActivatedRoute,
    private santizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.loader = true
    const query = new Map(Object.entries((this.route.snapshot.queryParamMap as any).params));
    const ruComponentType = query.get("ruComponentType")
    const componentName = query.get("componentName")
    const getObservable = observableApiMap.get(ruComponentType as string)
    console.log(ruComponentType, componentName, getObservable)
    if (ruComponentType && componentName && getObservable) {
      forkJoin([
        this.api.getAlias(),
        getObservable(this.api, (query as unknown) as Map<string, string>)
      ]).subscribe((res: any[]) => {
        console.log(res)
        let body = ''
        let header = ''
        const obj = res[1][0]
        const allias = res[0]
        for (const key in obj) {
          if (key == 'ruComponentType') {
            header += `<h1>${obj[key]}</h1>`
            continue
          }
          if (key == 'componentName' || key == 'manufacturerName') {
            header += `<h3>${allias[key] === undefined ? key : allias[key]}: ${obj[key]}</h1>`
            continue
          }
          body += `<p>${allias[key] === undefined ? key : allias[key]}: ${obj[key]}</p>`
        }
        this.header = this.santizer.bypassSecurityTrustHtml(`${header}`)
        this.body = this.santizer.bypassSecurityTrustHtml(`${body}`)
      })
      this.loader = false
    }
    // else {
    //   this.router.navigateByUrl('/not-found')
    // }
    // if (getObservable) {
    //   forkJoin([
    //     this.api.getAlias(),
    //     getObservable(this.api, (query as unknown) as Map<string, string>)
    //   ]).subscribe((res: any[]) => {
    //     console.log(res)
    // let markup = ''
    // const obj = res[1][0]
    // const allias = res[0]
    // for (const key in obj) {
    //   markup += `<p>${allias[key]}: ${obj[key]}</p>`
    // }
    // console.log(markup, obj)
    // this.layout = this.santizer.bypassSecurityTrustHtml(markup)
    //   })
    // }
    // this.route.paramMap.subscribe(params => {

    //   // console.log(this.params, this.params.get("componentName"))
    // })
  }

}
