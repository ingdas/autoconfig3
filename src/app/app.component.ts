import {Component} from '@angular/core';
import {IdpService} from '../services/idp.service';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(public idpService: IdpService, private messageService: MessageService) {
    idpService.onEmptyRelevance.subscribe(() => {
      this.messageService.add({severity: 'success', summary: 'Model Obtained', detail: 'There are no relevant symbols left'});
    });

  }

}
