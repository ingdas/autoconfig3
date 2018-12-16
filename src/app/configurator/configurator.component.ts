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

  @Input() meta: MetaInfo;

  shownSymbols: SymbolInfo [] = [];


  constructor(private idpService: IdpService, private configurationService: ConfigurationService) {
  }

  showSymbols(visibilityLevel: Visibility) {
    this.shownSymbols = this.meta.symbols.filter(x => !x.isImplicit && (toPriority(visibilityLevel) >= x.priority));
  }

  ngOnInit() {
    void this.idpService.getOptions(this.meta);
    this.configurationService.visibility.subscribe(lvl => this.showSymbols(lvl));
  }

}
