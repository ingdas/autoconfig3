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

  meta: Promise<MetaInfo>;
  private spec: Promise<string>;

  constructor(
    private http: HttpClient,
  ) {
    this.spec = this.http.get(AppSettings.SPECIFICATION_URL, {responseType: 'text'}).toPromise();
    this.meta = this.getMetaFile().pipe(map(str => MetaInfo.fromInput(JSON.parse(str)))).toPromise();
    this.getOptions();
  }

  private getMetaFile(): Observable<string> {
    return this.http.get(AppSettings.META_URL, {responseType: 'text'});
  }

  public callIDP(call: RemoteIdpCall): Observable<RemoteIdpResponse> {
    return this.http.post<RemoteIdpResponse>(AppSettings.IDP_ENDPOINT, JSON.stringify(call));
  }

  public async getOptions() {
    const input = {method: 'init', active: []};
    const opts = await this.makeCall(input);
    const meta = await this.meta;
    for (const symb of meta.symbols) {
      for (const v of opts[symb.idpname]) {
        symb.values.push(meta.makeValueInfo(v));
      }
    }
    this.doPropagation();
  }

  public async makeCall(input: Object): Promise<RemoteIdpResponse> {
    console.log(JSON.stringify(input));
    const meta = await this.meta;
    const symbols = meta.symbols.map(x => x.idpname);
    const spec = await this.spec;
    const code = 'include "config.idp"\n' + spec + this.outProcedure(symbols, input);
    const call = new RemoteIdpCall(code);

    return this.callIDP(call).pipe(map(x => {
      console.log(x);
      return JSON.parse(x.stdout);
    })).toPromise();
  }

  public async doPropagation() {
    const meta = await this.meta;
    const input = {method: 'propagate', propType: 'approx', active: meta.idpRepr};
    const outp = await this.makeCall(input);
    for (const s of meta.symbols) {
      for (const v of s.values) {
        const info = outp[s.idpname][JSON.stringify(v.idpname)];
        // Value Found
        if ((info['ct'] || info['cf'])) {
          // It is a propagation if it had no value
          if (v.value === null) {
            v.propagated = true;
          }
          v.value = info['ct'];
        } else {
          // No Value: Reset state
          v.value = null;
          v.propagated = false;
        }
      }
    }
  }

  public outProcedure(symbols: string[], input: object): string {
    console.log(symbols);
    return 'procedure out(){' +
      'output = {' + symbols.map(x => JSON.stringify(x)).join(',') + '}\n' +
      'li = [[' + JSON.stringify(input) + ']]' +
      '}';
  }
}
