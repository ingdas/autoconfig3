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

  constructor(public idpService: IdpService) {
  }

  get symbolGuiName(): string {
    return this.idpService.meta.getSymbol(this.symbolName).guiname;
  }

  get dependencySymbols() {
    return Object.getOwnPropertyNames(this.dependencies);
  }

  getDependencyValues(symbolName: string) {
    return this.dependencies[symbolName].sort();
  }

  ngOnInit() {
    this.idpService.getParams(this.symbolName, this.valueName).then(x => {
        this.dependencies = x;
      }
    );
  }

}
