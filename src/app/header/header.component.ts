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
      label: 'Edit File', icon: 'pi pi-fw pi-pencil',
      command: () => this.display = true
    },
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
    },
    {label: 'Reset Choices', icon: 'pi pi-fw pi-refresh', command: () => this.idpService.reset()},
    {label: 'Modelexpand', icon: 'pi pi-fw pi-window-maximize', command: () => this.idpService.mx()},
    {label: 'Undo Modelexpand', icon: 'pi pi-fw pi-trash', command: () => this.idpService.doPropagation()}
  ];

  visibility: Visibility;
  relevance: Relevance;

  constructor(private configurationService: ConfigurationService, public idpService: IdpService) {
    this.visibility = Visibility.CORE;
    this.relevance = Relevance.JUSTIFIED;
  }

  ngOnInit() {
    this.onVisibilityChanged(this.visibility);
    this.onRelevanceChanged(this.relevance);
  }

  onVisibilityChanged(visibility: Visibility) {
    this.configurationService.setVisibility(visibility);
    const curSetting = this.items[1].items;
    for (const a of curSetting) {
      // @ts-ignore
      a.icon = '';
    }
    // @ts-ignore
    curSetting[visibility].icon = 'pi pi-fw pi-eye';
  }

  onRelevanceChanged(relevance: Relevance) {
    this.configurationService.setRelevance(relevance);
    const curSetting = this.items[2].items;
    for (const a of curSetting) {
      // @ts-ignore
      a.icon = '';
    }
    // @ts-ignore
    curSetting[relevance].icon = 'pi pi-fw pi-circle-off';
  }

  layout() {
    window['pckry'].layout();
  }

}
