import { APP_ID, APP_INITIALIZER, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from '../services/api.services1';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  providers: [ApiService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',

})
export class AppComponent {

}
