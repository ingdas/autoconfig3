import {Component, Input} from '@angular/core';
import {SymbolInfo} from '../../../domain/metaInfo';
import {ConfigurationService} from '../../../services/configuration.service';
import {Visibility} from '../../../model/Visibility';
import {Collapse} from '../../../model/Collapse';

@Component({
  selector: 'app-symbol',
  templateUrl: './symbol.component.html',
  styleUrls: ['./symbol.component.css']
})
export class SymbolComponent {

  @Input()
  info: SymbolInfo;
  relevantOnly = false;
  collapseLevel = 0;

  constructor(private configurationService: ConfigurationService) {
    this.configurationService.visibility.subscribe(x => this.relevantOnly = x === Visibility.RELEVANT);
    this.configurationService.collapse.subscribe(x => this.collapseLevel = x );
  }

  shownRelValues(values) {
    if (this.relevantOnly) {
      return values.filter(x => x.assignment.relevant || x.assignment.known || this.info.priority === 0);
    }
    return this.info.values;
  }
  shownColValues(values) {
    switch (this.collapseLevel) {
      case Collapse.ALL: return values;
      case Collapse.POSSIBLE: return values.filter(x => x.assignment.possible);
      case Collapse.CERTAIN: return values.filter(x => x.assignment.certain);
    }
  }
  get shownValues() {
    return this.shownColValues(this.shownRelValues(this.info.values));
  }

}
