import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from '../../services/api.services';
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
  templateUrl: './item-info-template.component.html',
  providers: [ApiService],
  styleUrls: ['./item-info-template.component.css', '../components/styles/button.css'],
  encapsulation: ViewEncapsulation.None
})
export class ItemInfoTemplateComponent implements OnInit {
  header: any
  body: any
  loader!: boolean
  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private santizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.loader = true
    const query = new Map(Object.entries((this.route.snapshot.queryParamMap as any).params));
    const enComponentType = query.get("enComponentType")
    const id = parseInt(query.get("id") as string)
    // console.log(enComponentType, id)
    forkJoin([
      this.api.getAlias(),
      this.api.getComponent(enComponentType as string, id)
    ]).subscribe((res: any[]) => {
      let body = ''
      let header = ''
      const obj = res[1]
      const alias = res[0]
      for (const key in obj) {
        if (key == 'componentName' || key == 'manufacturerName') {
          header += `<h3>${alias[key] === undefined ? key : alias[key]}: ${obj[key]}</h1>`
          continue
        }
        body += `<p>${alias[key] === undefined ? key : alias[key]}: ${obj[key]}</p>`
      }
      this.header = this.santizer.bypassSecurityTrustHtml(`${header}`)
      this.body = this.santizer.bypassSecurityTrustHtml(`${body}`)
      this.loader = false
    })

  }
  getBack(): void {
    window.history.back()
  }
}
