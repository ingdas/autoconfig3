import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {AppSettings} from './AppSettings';
import {Visibility} from '../model/Visibility';
import {Relevance} from '../model/Relevance';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  visibility: Subject<Visibility>;
  relevance: Subject<Relevance>;

  constructor() {
    this.visibility = new BehaviorSubject(AppSettings.DEFAULT_VISIBILITY);
    this.relevance = new BehaviorSubject(AppSettings.DEFAULT_RELEVANCE);
  }

  setVisibility(visibility: Visibility): void {
    this.visibility.next(visibility);
  }

  setRelevance(relevance: Relevance): void {
    this.relevance.next(relevance);
  }
}
