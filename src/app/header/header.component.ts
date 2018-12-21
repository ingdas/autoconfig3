import {Component, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';
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

  display = false;
  items: MenuItem[] = [
    {
      label: 'Edit File',
      command: () => this.display = true
    },
    {
      label: 'Settings',
      icon: 'pi pi-fw pi-pencil',
      items: [
        {
          label: 'Visibility', icon: 'pi pi-fw pi-eye',
          items: [{
            label: 'Core', command: () => {
              this.onVisibilityChanged(Visibility.CORE);
            }
          }, {
            label: 'Relevant', command: () => {
              this.onVisibilityChanged(Visibility.RELEVANT);
            }
          }, {
            label: 'All', command: () => {
              this.onVisibilityChanged(Visibility.ALL);
            }
          }]
        },
        {
          label: 'Relevance Notion', icon: 'pi pi-fw pi-circle-off',
          items: [
            {label: 'Justified', command: () => this.onRelevanceChanged(Relevance.JUSTIFIED)},
            {label: 'Propagated', command: () => this.onRelevanceChanged(Relevance.PROPAGATED)}
          ]
        }
      ]
    },
    {label: 'Reset Choices', icon: 'pi pi-fw pi-refresh', command: () => this.idpService.reset()},
    {label: 'Modelexpand', command: () => this.idpService.mx()},
    {label: 'Undo Modelexpand', command: () => this.idpService.doPropagation()}
  ];

  visibility: Visibility;
  relevance: Relevance;

  constructor(private configurationService: ConfigurationService, private idpService: IdpService) {
    this.visibility = Visibility.CORE;
    this.relevance = Relevance.JUSTIFIED;
  }

  ngOnInit() {
    this.onVisibilityChanged(this.visibility);
    this.onRelevanceChanged(this.relevance);
  }

  onVisibilityChanged(visibility: Visibility) {
    this.configurationService.setVisibility(visibility);
    // @ts-ignore
    for (const a of this.items[1].items[0].items) {
      a.icon = '';
    }
    // @ts-ignore
    this.items[1].items[0].items[visibility].icon = 'pi pi-fw pi-eye';
  }

  onRelevanceChanged(relevance: Relevance) {
    this.configurationService.setRelevance(relevance);
    // @ts-ignore
    for (const a of this.items[1].items[1].items) {
      a.icon = '';
    }
    // @ts-ignore
    this.items[1].items[1].items[relevance].icon = 'pi pi-fw pi-circle-off';
  }

  layout() {
    window['pckry'].layout();
  }

}
