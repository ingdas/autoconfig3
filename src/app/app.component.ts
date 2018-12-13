import {Component, OnInit} from '@angular/core';
import {IdpService} from '../services/idp.service';
import {MetaInfo} from '../domain/metaInfo';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public specification: string;
  public metaInfo: MetaInfo;

  constructor(private idpService: IdpService) {
  }

  public getSpec(): void {
    this.idpService.getSpecification().subscribe(spec => {
      this.specification = spec;
    }, err => console.log(err));
  }

  public getMetaInfo(): void {
    this.idpService.getMetaInfo().subscribe(info => {
      this.metaInfo = info;
    }, err => console.log(err));
  }

  public ngOnInit(): void {
    this.getSpec();
    this.getMetaInfo();
  }

  public test(): void {
  }

}
