import {Component, OnInit} from '@angular/core';
import {SymbolInfo} from '../../domain/metaInfo';
import {ConfigurationService} from '../../services/configuration.service';
import {toPriority, Visibility} from '../../model/Visibility';
import {IdpService} from '../../services/idp.service';

@Component({
  selector: 'app-configurator',
  templateUrl: './configurator.component.html',
  styleUrls: ['./configurator.component.css']
})
export class ConfiguratorComponent implements OnInit {

  shownSymbols: SymbolInfo [] = [];


  constructor(private idpService: IdpService, private configurationService: ConfigurationService) {
  }

  async showSymbols(visibilityLevel: Visibility) {
    const meta = await this.idpService.meta;
    const cands = meta.symbols.filter(x => !x.isImplicit);
    switch (visibilityLevel) {
      case Visibility.ALL:
        this.shownSymbols = cands;
        break;
      case Visibility.CORE:
        this.shownSymbols = cands.filter(x => toPriority(visibilityLevel) >= x.priority);
        break;
      case Visibility.RELEVANT:
        this.shownSymbols = cands.filter(x => x.relevant || x.known);
        break;
    }
  }

  ngOnInit() {
    this.configurationService.visibility.subscribe(lvl => this.showSymbols(lvl));
  }

}
