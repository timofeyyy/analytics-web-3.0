import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigatorComponent } from './components/navigator/navigator.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

}
