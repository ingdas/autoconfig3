import {Component, OnInit} from '@angular/core';
import {IdpService} from '../services/idp.service';
import {MetaInfo} from '../domain/metaInfo';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private idpService: IdpService) {
  }


  title = 'Title';

  ngOnInit(): void {
    this.idpService.meta.then(x => this.title = x.title);
  }

  public test(): void {
    this.idpService.doPropagation();
  }

}
