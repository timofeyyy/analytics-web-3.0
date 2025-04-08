import { Component, OnInit } from '@angular/core';
import { NavigatorComponent } from '../components/navigator/navigator.component';
import { CountrySelectionComponent } from '../components/selection/country-selection/country-selection.component';
import { ActivatedRoute } from '@angular/router';
import { ChartTypesCheckboxesComponent } from '../components/chart-types-checkboxes/chart-types-checkboxes.component';
import { DomSanitizer } from '@angular/platform-browser';
import { PropNameSelectionComponent } from '../components/selection/prop-name-selection/prop-name-selection.component';

@Component({
  selector: 'app-component-template',
  imports: [NavigatorComponent, CountrySelectionComponent, PropNameSelectionComponent, ChartTypesCheckboxesComponent],
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
