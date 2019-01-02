import {Component} from '@angular/core';
import {IdpService} from '../services/idp.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(public idpService: IdpService) {
  }

}
