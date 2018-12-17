import {Component, OnInit} from '@angular/core';
import {IdpService} from '../services/idp.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'Title';

  constructor(private idpService: IdpService) {
  }

  ngOnInit(): void {
    this.idpService.meta.then(x => this.title = x.title);
  }

  public test(): void {
    this.idpService.doPropagation();
  }

}
