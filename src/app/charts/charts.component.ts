import { Component } from '@angular/core';
import { CountrySelectionComponent } from '../components/selection/country-selection/country-selection.component';
import { NavigatorComponent } from '../components/navigator/navigator.component';

@Component({
  selector: 'app-charts',
  imports: [NavigatorComponent, CountrySelectionComponent],
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.css'
})
export class ChartsComponent {

}
