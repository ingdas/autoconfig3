import {Component, Input, OnInit} from '@angular/core';
import {AppSettings} from '../../services/AppSettings';
import {SelectItem} from 'primeng/api';
import {UISettings} from '../../domain/metaInfo';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input()
  public settings: UISettings;


  visibilities: SelectItem[];

  relevances: SelectItem[];

  constructor() {
    this.visibilities = [
      {label: 'Core', value: 0},
      {label: 'Relevant', value: 1},
      {label: 'All', value: 2}
    ];

    this.relevances = [
      {label: 'Justified', value: true},
      {label: 'Propagated', value: false}
    ];
  }

  ngOnInit() {
  }

}
