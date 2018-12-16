import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {RemoteIdpCall, RemoteIdpResponse} from '../domain/remote-data';
import {AppSettings} from './AppSettings';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {MetaInfo} from '../domain/metaInfo';
import {Meta} from '@angular/platform-browser';

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
    return this.http.post<RemoteIdpResponse>(AppSettings.IDP_ENDPOINT, JSON.stringify(call));
  }

  public async getOptions(meta: MetaInfo) {
    const input = {method: 'init', active: []};
    const opts = await this.makeCall(meta, input);

    for (const symb of meta.symbols) {
      for (const v of opts[symb.idpname]) {
        symb.values.push(meta.makeValueInfo(v));
      }
    }
  }

  public async makeCall(meta: MetaInfo, input: Object): Promise<RemoteIdpResponse> {
    console.log(JSON.stringify(input))
    const spec = await this.getSpecification().toPromise();
    const symbols = meta.symbols.map(x => x.idpname);
    const code = 'include "config.idp"\n' + spec + this.outProcedure(symbols);
    const call = new RemoteIdpCall(code, JSON.stringify(input));

    return this.callIDP(call).pipe(map(x => {
      console.log(x);
      return JSON.parse(x.stdout);
    })).toPromise();
  }

  public async doPropagation(meta: MetaInfo) {
    const input = JSON.stringify({method: 'propagate', propType: 'approx', active: meta.idpRepr});
    const outp = await this.makeCall(meta, input);
    console.log(outp);
  }

  public outProcedure(symbols: string[]): string {
    console.log(symbols);
    return 'procedure out(){' +
      'output = {' + symbols.map(x => JSON.stringify(x)).join(',') + '}' +
      '}';
  }
}
