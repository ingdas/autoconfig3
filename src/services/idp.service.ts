import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {RemoteIdpCall, RemoteIdpResponse} from '../domain/remote-data';
import {AppSettings} from './AppSettings';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {MetaInfo} from '../domain/metaInfo';

@Injectable()
export class IdpService {

  constructor(
    private http: HttpClient,
  ) {
  }

  public getMetaFile(): Observable<string> {
    return this.http.get(AppSettings.META_URL, {responseType: 'text'});
  }

  public getSpecification(): Observable<string> {
    return this.http.get(AppSettings.SPECIFICATION_URL, {responseType: 'text'});
  }

  public getMetaInfo(): Observable<MetaInfo> {
    return this.getMetaFile().pipe(map(str => JSON.parse(str)));
  }

  public callIDP(call: RemoteIdpCall): Observable<RemoteIdpResponse> {
    return this.http.post<RemoteIdpResponse>(AppSettings.IDP_ENDPOINT, JSON.stringify(call));
  }
}
