import {Component, Input, OnInit} from '@angular/core';
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

  ngOnInit() {
    // REFINE!, SUBSCRIBE TO VISIBILITYLEVEL
    this.shownSymbols = this.meta.symbols.filter(x => !x.isImplicit && (this.settings.visibilityLevel > 0 || x.priority === 'core'));
  }

}
