import {Component, Input, OnInit} from '@angular/core';
import {IdpService} from '../../../services/idp.service';

@Component({
  selector: 'app-showexplain',
  templateUrl: './showexplain.component.html',
  styleUrls: ['./showexplain.component.css']
})
export class ShowexplainComponent implements OnInit {

  @Input()
  symbolName: string;

  @Input()
  valueName: string;

  explanation: object;

  constructor(private idpService: IdpService) {
  }

  get dependencySymbols() {
    return Object.getOwnPropertyNames(this.explanation);
  }

  getDependencyValues(symbolName: string) {
    return this.explanation[symbolName].sort();
  }

  ngOnInit() {
    this.idpService.explain(this.symbolName, this.valueName).then(x => {
        // Remove yourself from the explanation
        this.explanation = x;
        this.explanation[this.symbolName] = this.explanation[this.symbolName].filter(y => y !== this.valueName);
        if (this.explanation[this.symbolName].length === 0) {
          delete this.explanation[this.symbolName];
        }
      }
    );
  }

}
