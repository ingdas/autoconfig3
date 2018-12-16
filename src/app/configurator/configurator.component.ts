import {Component, Input, OnInit} from '@angular/core';
import {MetaInfo, SymbolInfo} from '../../domain/metaInfo';
import {ConfigurationService} from '../../services/configuration.service';
import {toPriority, Visibility} from '../../model/Visibility';

@Component({
  selector: 'app-configurator',
  templateUrl: './configurator.component.html',
  styleUrls: ['./configurator.component.css']
})
export class ConfiguratorComponent implements OnInit {

  @Input() meta: MetaInfo;

  shownSymbols: SymbolInfo [] = [];


  constructor(private configurationService: ConfigurationService) {
  }

  showSymbols(visibilityLevel: Visibility) {
    this.shownSymbols = this.meta.symbols.filter(x => !x.isImplicit && (toPriority(visibilityLevel) >= x.priority));
  }

  ngOnInit() {
    this.configurationService.visibility.subscribe(lvl => this.showSymbols(lvl));
  }

}
