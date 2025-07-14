import { Component, OnInit } from '@angular/core';
import { NavigatorComponent } from "../../components/navigator/navigator.component";
import { Location, NgIf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-table-chart-template',
  imports: [NavigatorComponent, NgIf],
  templateUrl: './table-chart-template.component.html',
  styleUrl: './table-chart-template.component.css'
})
export class TableChartTemplateComponent implements OnInit {
  url!: any
  type_name!: string
  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) { }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.type_name = params.get('type_name') as string;
      let obj = JSON.parse(window.localStorage.getItem('selection') as string)
      if (obj && obj.chartPages && obj.chartPages[this.type_name]) {
        console.log(obj.chartPages[this.type_name])
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(
          obj.chartPages[this.type_name]
        )
      }
      else {
        this.location.back()
      }
    })
  }
}
