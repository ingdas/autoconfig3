import {Component, Input} from '@angular/core';
import {SymbolInfo} from '../../../domain/metaInfo';
import {ConfigurationService} from '../../../services/configuration.service';
import {Visibility} from '../../../model/Visibility';

@Component({
  selector: 'app-symbol',
  templateUrl: './symbol.component.html',
  styleUrls: ['./symbol.component.css']
})
export class SymbolComponent {

  @Input()
  info: SymbolInfo;
  relevantOnly = false;

  get shownValues() {
    if (this.relevantOnly) {
      return this.info.values.filter(x => x.relevant || x.known);
    }
    return this.info.values;
  }

  constructor(private configurationService: ConfigurationService) {
    this.configurationService.visibility.subscribe(x => this.relevantOnly = x === Visibility.RELEVANT);
  }

}
