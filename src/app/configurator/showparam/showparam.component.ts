import {Component, Input, OnInit} from '@angular/core';
import {IdpService} from '../../../services/idp.service';

@Component({
  selector: 'app-showparam',
  templateUrl: './showparam.component.html',
  styleUrls: ['./showparam.component.css']
})
export class ShowparamComponent implements OnInit {

  @Input()
  symbolName: string;

  @Input()
  valueName: string;

  dependencies: object;

  get dependencySymbols() {
    return Object.getOwnPropertyNames(this.dependencies);
  }

  getDependencyValues(symbolName: string) {
    return Object.getOwnPropertyNames(this.dependencies[symbolName]);
  }

  constructor(private idpService: IdpService) {
  }

  ngOnInit() {
    this.idpService.getParams(this.symbolName, this.valueName).then(x =>
      this.dependencies = x
    );
  }

}
