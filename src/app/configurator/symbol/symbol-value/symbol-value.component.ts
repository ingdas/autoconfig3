import {Component, Input, OnInit} from '@angular/core';
import {ValueInfo} from '../../../../domain/metaInfo';

@Component({
  selector: 'app-symbol-value',
  templateUrl: './symbol-value.component.html',
  styleUrls: ['./symbol-value.component.css']
})
export class SymbolValueComponent implements OnInit {

  @Input()
  public valueInfo: ValueInfo;

  constructor() {
  }

  ngOnInit() {
  }

}
