import {Component, OnInit} from '@angular/core';
import {AppSettings} from '../../services/AppSettings';
import {SelectItem} from 'primeng/api';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public visibilityLevel: number = AppSettings.DEFAULT_VISIBILITY;
  public justifiedRelevance: boolean = AppSettings.DEFAULT_JUSTIFIEDRELEVANCE;


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
