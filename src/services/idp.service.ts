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
    return this.getMetaFile().pipe(map(str => MetaInfo.fromInput(JSON.parse(str))));
  }

  public callIDP(call: RemoteIdpCall): Observable<RemoteIdpResponse> {
    console.log(call);
    return this.http.post<RemoteIdpResponse>(AppSettings.IDP_ENDPOINT, JSON.stringify(call));
  }

  public getOptions(specification: string, symbols: string[]): Observable<Object> {
    const code = 'include "config.idp"\n' + specification + this.outProcedure(symbols);
    const input = JSON.stringify({method: 'init', active: []});
    const call = new RemoteIdpCall(code, input);
    return this.callIDP(call).pipe(map(x => {
      return JSON.parse(x.stdout);
    }));
  }

  public outProcedure(symbols: string[]): string {
    console.log(symbols);
    return 'procedure out(){' +
      'output = {' + symbols.map(x => JSON.stringify(x)).join(',') + '}' +
      '}';
  }
}
