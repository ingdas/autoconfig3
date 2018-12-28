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


  constructor(private idpService: IdpService, private configurationService: ConfigurationService, private elementRef: ElementRef) {
  }

  get shownSymbols(): SymbolInfo[] {
    const meta = this.idpService.meta;
    const cands = meta.symbols.filter(x => !x.isImplicit);
    switch (this.idpService.meta.visibility) {
      case Visibility.ALL:
        return cands;
        break;
      case Visibility.CORE:
        return cands.filter(x => toPriority(this.idpService.meta.visibility) >= x.priority);
        break;
      case Visibility.RELEVANT:
        return cands.filter(x => x.relevant || x.known);
        break;
    }
  }

  ngOnInit() {

    const pckry = new Packery(this.elementRef.nativeElement, {
      itemSelector: 'app-configurator > app-symbol',
      packery: {
        gutter: 50
      }
    });
    window['pckry'] = pckry;

    const mo = new MutationObserver(x => {
      pckry.reloadItems();
      pckry.layout();
    });
    mo.observe(this.elementRef.nativeElement, {childList: true, subtree: true});
  }

}
