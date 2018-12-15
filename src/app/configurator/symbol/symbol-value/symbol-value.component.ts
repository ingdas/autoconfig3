import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-symbol-value',
  templateUrl: './symbol-value.component.html',
  styleUrls: ['./symbol-value.component.css']
})
export class SymbolValueComponent implements OnInit {

  @Input()
  public i: number;

  constructor() {
  }

  ngOnInit() {
  }

}
