import {Component, Input, OnInit} from '@angular/core';
import {ValueInfo} from '../../../../../../domain/metaInfo';
import {IdpService} from '../../../../../../services/idp.service';

@Component({
  selector: 'app-symbol-value-selector-buttons',
  templateUrl: './symbol-value-selector-buttons.component.html',
  styleUrls: ['./symbol-value-selector-buttons.component.css']
})
export class SymbolValueSelectorButtonsComponent implements OnInit {

  @Input()
  valueName: string;

  @Input()
  symbolName: string;

  info: ValueInfo;
  explain = false;

  constructor(private idpService: IdpService) {
  }

  ngOnInit() {
    this.idpService.getValueInfo(this.symbolName, this.valueName).then(x => this.info = x);
  }

}
