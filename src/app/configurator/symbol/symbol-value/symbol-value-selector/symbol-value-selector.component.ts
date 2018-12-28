import {Component, Input, OnInit} from '@angular/core';
import {ValueInfo} from '../../../../../domain/metaInfo';
import {IdpService} from '../../../../../services/idp.service';

@Component({
  selector: 'app-symbol-value-selector',
  templateUrl: './symbol-value-selector.component.html',
  styleUrls: ['./symbol-value-selector.component.css']
})
export class SymbolValueSelectorComponent implements OnInit {

  @Input()
  info: ValueInfo;
  explain = false;

  constructor(private idpService: IdpService) {
  }

  ngOnInit() {
  }

}
