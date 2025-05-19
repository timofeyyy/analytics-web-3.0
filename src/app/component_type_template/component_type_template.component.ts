import { Component, OnInit } from '@angular/core';
import { NavigatorComponent } from '../components/navigator/navigator.component';
import { CountrySelectionComponent } from '../components/selection/country_selection/country_selection.component';
import { ActivatedRoute } from '@angular/router';
import { ChartTypesCheckboxesComponent } from '../components/chart_types_checkboxes/chart_types_checkboxes.component';
import { DomSanitizer } from '@angular/platform-browser';
import { PropNameSelectionComponent } from '../components/selection/prop_name_selection/prop_name_selection.component';
import { AppEnum } from '../../utils/enum/app.enum';

@Component({
  selector: 'app-component-template',
  imports: [NavigatorComponent, CountrySelectionComponent, PropNameSelectionComponent, ChartTypesCheckboxesComponent],
  templateUrl: './component_type_template.component.html',
  styleUrl: './component_type_template.component.css'
})
export class TypeTemplateComponent implements OnInit {

  componentType!: string | null
  prop!: string | null
  chart!: string | null
  url: any
  constructor(
    private route: ActivatedRoute,
    private santizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.onChartTypeChnage("donut")
    this.onPropChange(AppEnum.NONE)
  } 

  onChartTypeChnage(value: string): void {
    this.chart = value
    this.buildChart()
  }

  buildChart(): void {
    this.route.paramMap.subscribe(params => {
      this.componentType = params.get('ruComponentType')
      console.log(this.prop)
      if (this.prop && this.chart) {
        let url: string = `chart1/parent/components/componentTypes/${this.chart}?ruComponentType=${this.componentType}`
        if(this.prop != AppEnum.NONE) {
          url+=`&&child_req_name=${this.prop}&&child_chart_name=${this.prop}`
        }
        this.url = this.santizer.bypassSecurityTrustResourceUrl(url)
      }
    })
  }

  onPropChange(value: string): void {
    this.prop = value
    this.buildChart()
  }
}
