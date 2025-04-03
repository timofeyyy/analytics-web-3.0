import { Component, OnInit } from '@angular/core';
import { NavigatorComponent } from '../components/navigator/navigator.component';
import { CountrySelectionComponent } from '../components/selection/country-selection/country-selection.component';
import { ActivatedRoute } from '@angular/router';
import { PropSelectionComponent } from '../components/selection/prop-selection/prop-selection.component';
import { ChartTypesCheckboxesComponent } from '../components/chart-types-checkboxes/chart-types-checkboxes.component';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-component-template',
  imports: [NavigatorComponent, CountrySelectionComponent, PropSelectionComponent, ChartTypesCheckboxesComponent],
  templateUrl: './component-template.component.html',
  styleUrl: './component-template.component.css'
})
export class ComponentTemplateComponent implements OnInit {

  componentType!: string | null
  url: any
  constructor (
    private route: ActivatedRoute,
    private santizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.onChnage("donut")
  }

  onChnage(chart: string): void {
    this.route.paramMap.subscribe(params => {
      this.componentType = params.get('componentType')
      this.url = this.santizer.bypassSecurityTrustResourceUrl(`chart/${this.componentType}/manufacturers/${chart}`)
    })
  }
}
