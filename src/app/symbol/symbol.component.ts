import {Component, Input, OnInit} from '@angular/core';
import {SymbolInfo} from '../../domain/metaInfo';

@Component({
  selector: 'app-symbol',
  templateUrl: './symbol.component.html',
  styleUrls: ['./symbol.component.css']
})
export class SymbolComponent implements OnInit {

  @Input()
  public info: SymbolInfo;

  public relevant = true;

  private longInfoVisible = false;

  constructor() {
  }

  ngOnInit() {
  }

}
