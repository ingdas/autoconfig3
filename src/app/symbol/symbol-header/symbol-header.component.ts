import {Component, Input, OnInit} from '@angular/core';
import {SymbolInfo} from '../../../domain/metaInfo';

@Component({
  selector: 'app-symbol-header',
  templateUrl: './symbol-header.component.html',
  styleUrls: ['./symbol-header.component.css']
})
export class SymbolHeaderComponent implements OnInit {

  @Input()
  info: SymbolInfo;

  longInfoVisible = false;

  constructor() {
  }

  ngOnInit() {
  }

}
