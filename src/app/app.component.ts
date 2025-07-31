import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigatorComponent } from './components/navigator/navigator.component';
import { HttpClientModule } from '@angular/common/http';
import { ApiService1 } from '../services/api.services1';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HttpClientModule],
  providers: [ApiService1],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  constructor (
    private api: ApiService1
  ) {}

  ngOnInit(): void {
    // this.api.getAlias()?.subscribe((res) => )
  }

}
