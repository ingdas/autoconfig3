import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {AppSettings} from './AppSettings';
import {Visibility} from '../model/Visibility';
import {Relevance} from '../model/Relevance';
import {Collapse} from '../model/Collapse';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  visibility: Subject<Visibility>;
  collapse: Subject<Collapse>;
  relevance: Subject<Relevance>;

  constructor() {
    this.visibility = new BehaviorSubject(AppSettings.DEFAULT_VISIBILITY);
    this.collapse = new BehaviorSubject(AppSettings.DEFAULT_COLLAPSE);
    this.relevance = new BehaviorSubject(AppSettings.DEFAULT_RELEVANCE);
  }

  setVisibility(visibility: Visibility): void {
    this.visibility.next(visibility);
  }

  setCollapse(collapse: Collapse): void {
    this.collapse.next(collapse);
  }

  setRelevance(relevance: Relevance): void {
    this.relevance.next(relevance);
  }
}
