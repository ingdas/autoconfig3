import {Component, OnInit} from '@angular/core';
import {IdpService} from '../services/idp.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public specification: string;

  constructor(private idpService: IdpService) {
  }

  public getSpec(): void {
    console.log('sub');
    this.idpService.getSpecification().subscribe(spec => {
      this.specification = spec;
    }, err => console.log(err));
  }

  public ngOnInit(): void {
    this.getSpec();
  }

  public test(): void {
    this.idpService.getAppInfo().subscribe(x => console.log(x));
  }

}
