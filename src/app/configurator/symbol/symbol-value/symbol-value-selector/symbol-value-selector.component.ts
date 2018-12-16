import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-symbol-value-selector',
  templateUrl: './symbol-value-selector.component.html',
  styleUrls: ['./symbol-value-selector.component.css']
})
export class SymbolValueSelectorComponent implements OnInit {

  propagated = false;
  relevant = true;
  value = null;

  get known(): boolean {
    return this.value !== null;
  }

  constructor() {
  }

  ngOnInit() {
  }

}
