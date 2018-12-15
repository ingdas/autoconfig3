import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {MetaInfo, SymbolInfo, UISettings} from '../../domain/metaInfo';

@Component({
  selector: 'app-configurator',
  templateUrl: './configurator.component.html',
  styleUrls: ['./configurator.component.css']
})
export class ConfiguratorComponent implements OnInit {

  @Input() meta: MetaInfo;
  @Input() settings: UISettings;

  shownSymbols: SymbolInfo [] = [];


  constructor() {
  }

  showSymbols(visibilityLevel: Number) {
    this.shownSymbols = this.meta.symbols.filter(x => !x.isImplicit && (visibilityLevel >= x.priority));
  }

  ngOnInit() {
    this.showSymbols(this.settings.visibilityLevel);
    this.settings.visibilityLevelEM.subscribe(lvl => this.showSymbols(lvl));
  }

}
