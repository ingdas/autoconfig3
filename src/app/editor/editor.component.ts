import {Component, OnInit} from '@angular/core';
import {IdpService} from '../../services/idp.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent {
  editorOptions = {theme: 'vs', language: 'text'};
  jsonEditorOptions = {theme: 'vs', language: 'json'};

  constructor(public idpService: IdpService) {

  }
}
