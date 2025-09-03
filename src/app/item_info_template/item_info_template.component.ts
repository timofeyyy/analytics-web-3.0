import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService1 } from '../../services/api.services1';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { forkJoin, map } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigatorComponent } from "../components/navigator/navigator.component";
import { LoaderComponent } from "../components/loader/loader.component";
import { NgStyle } from '@angular/common';
import { observableApiMap } from '../../utils/static-data/observables';

@Component({
  selector: 'app-item-info-template',
  imports: [HttpClientModule, NavigatorComponent, LoaderComponent, NgStyle],
  templateUrl: './item_info_template.component.html',
  providers: [ApiService1],
  styleUrls: ['./item_info_template.component.css', '../components/styles/button.css'],
  encapsulation: ViewEncapsulation.None
})
export class ItemInfoTemplateComponent implements OnInit {
  header: any
  body: any
  loader!: boolean
  constructor(
    private api: ApiService1,
    private route: ActivatedRoute,
    private santizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.loader = true
    const query = new Map(Object.entries((this.route.snapshot.queryParamMap as any).params));
    const ruComponentType = query.get("ruComponentType")
    const componentName = query.get("componentName")
    const getObservable = observableApiMap.get(ruComponentType as string)
    if (ruComponentType && componentName && getObservable) {
      forkJoin([
        this.api.getAlias(),
        getObservable(this.api, (query as unknown) as Map<string, string>)
      ]).subscribe((res: any[]) => {
        let body = ''
        let header = ''
        const obj = res[1][0]
        const allias = res[0]
        for (const key in obj) {
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
  }
  getBack(): void {
     window.history.back()
  }
}
