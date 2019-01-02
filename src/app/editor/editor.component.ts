import {Component} from '@angular/core';
import {IdpService} from '../../services/idp.service';
import {RemoteIdpCall} from '../../domain/remote-data';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent {
  editorOptions = {theme: 'vs', language: 'text'};
  jsonEditorOptions = {theme: 'vs', language: 'json'};
  errStream = '';

  constructor(public idpService: IdpService) {

  }

  checkSyntax() {
    this.errStream = '';
    const call = new RemoteIdpCall(this.idpService.spec);
    call.code += 'procedure main() {}';
    this.idpService.callIDP(call).subscribe(x => {
        this.errStream = '\n' + x.stderr;
      }
    );
  }

  clear() {
    this.errStream = '';
  }
}
