import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-value',
  templateUrl: './value.component.html',
  styleUrls: ['./value.component.css']
})
export class ValueComponent implements OnInit {

  @Input()
  public i: number;

  constructor() {
  }

  ngOnInit() {
  }

}
