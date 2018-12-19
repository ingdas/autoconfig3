import {Component, ElementRef, OnInit} from '@angular/core';
import {SymbolInfo} from '../../domain/metaInfo';
import {ConfigurationService} from '../../services/configuration.service';
import {toPriority, Visibility} from '../../model/Visibility';
import {IdpService} from '../../services/idp.service';

declare var Packery: any;


@Component({
  selector: 'app-configurator',
  templateUrl: './configurator.component.html',
  styleUrls: ['./configurator.component.css']
})
export class ConfiguratorComponent implements OnInit {

  shownSymbols: SymbolInfo [] = [];


  constructor(private idpService: IdpService, private configurationService: ConfigurationService, private elementRef: ElementRef) {
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

    const pckry = new Packery(this.elementRef.nativeElement, {
      itemSelector: 'app-symbol',
      packery: {
        gutter: 50
      }
    });

    const mo = new MutationObserver(x => {
      pckry.reloadItems();
      pckry.layout();
    });
    mo.observe(this.elementRef.nativeElement, {childList: true, subtree: true});
  }

}
