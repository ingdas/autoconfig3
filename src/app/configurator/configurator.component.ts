import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {MetaInfo, SymbolInfo, UISettings} from '../../domain/metaInfo';

@Component({
  selector: 'app-configurator',
  templateUrl: './configurator.component.html',
  styleUrls: ['./configurator.component.css']
})
export class ConfiguratorComponent implements OnChanges {

  @Input() meta: MetaInfo;
  @Input() settings: UISettings;

  shownSymbols: SymbolInfo [] = [];


  constructor() {
  }

  ngOnChanges() {
    // SUBSCRIBE TO VISIBILITYLEVEL
    this.shownSymbols = this.meta.symbols.filter(x => !x.isImplicit && (this.settings.visibilityLevel >= x.priority));
  }

}
