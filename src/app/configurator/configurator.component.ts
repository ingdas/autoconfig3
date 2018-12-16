import {Component, Input, OnInit} from '@angular/core';
import {MetaInfo, SymbolInfo} from '../../domain/metaInfo';
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
    this.shownSymbols = meta.symbols.filter(x => !x.isImplicit && (toPriority(visibilityLevel) >= x.priority));
  }

  ngOnInit() {
    this.configurationService.visibility.subscribe(lvl => this.showSymbols(lvl));
  }

}
