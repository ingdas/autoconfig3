import {Component, OnInit} from '@angular/core';
import {SelectItem} from 'primeng/api';
import {Relevance} from '../../model/Relevance';
import {ConfigurationService} from '../../services/configuration.service';
import {Visibility} from '../../model/Visibility';
import {IdpService} from '../../services/idp.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  visibilities: SelectItem[];
  relevances: SelectItem[];

  visibility: Visibility;
  relevance: Relevance;

  constructor(private configurationService: ConfigurationService, private idpService: IdpService) {
    this.visibilities = [
      {label: 'Core', value: Visibility.CORE},
      {label: 'Relevant', value: Visibility.RELEVANT},
      {label: 'All', value: Visibility.ALL}
    ];

    this.relevances = [
      {label: 'Justified', value: Relevance.JUSTIFIED},
      {label: 'Propagated', value: Relevance.PROPAGATED}
    ];
    this.visibility = Visibility.CORE;
    this.relevance = Relevance.JUSTIFIED;
  }

  ngOnInit() {
    this.onVisibilityChanged(this.visibility);
    this.onRelevanceChanged(this.relevance);
  }

  onVisibilityChanged(visibility: Visibility) {
    this.configurationService.setVisibility(visibility);
  }

  onRelevanceChanged(relevance: Relevance) {
    this.configurationService.setRelevance(relevance);
  }

  layout() {
    window['pckry'].layout();
  }

}
