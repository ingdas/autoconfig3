import {Component, Input, OnInit} from '@angular/core';
import {CurrentAssignment} from '../../../../../../domain/metaInfo';
import {IdpService} from '../../../../../../services/idp.service';

@Component({
  selector: 'app-symbol-value-selector-buttons',
  templateUrl: './symbol-value-selector-buttons.component.html',
  styleUrls: ['./symbol-value-selector-buttons.component.css']
})
export class SymbolValueSelectorButtonsComponent implements OnInit {

  @Input()
  assignment: CurrentAssignment;

  explain = false;

  constructor(public idpService: IdpService) {
  }

  ngOnInit() {
  }

}
