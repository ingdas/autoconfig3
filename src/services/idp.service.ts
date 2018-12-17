import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {RemoteIdpCall, RemoteIdpResponse} from '../domain/remote-data';
import {AppSettings} from './AppSettings';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {MetaInfo, ValueInfo} from '../domain/metaInfo';

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
    void this.doPropagation();
  }

  public async makeCall(input: Object): Promise<object> {
    const meta = await this.meta;
    const symbols = meta.symbols.map(x => x.idpname);
    const spec = await this.spec;
    const code = 'include "config.idp"\n' + spec + this.outProcedure(symbols, input);
    const call = new RemoteIdpCall(code);

    return this.callIDP(call).pipe(map(x => {
      console.log(input, x);
      if (x.stdout === '') {
        return {};
      }
      return JSON.parse(x.stdout);
    })).toPromise();
  }

  public async doPropagation() {
    const meta = await this.meta;
    const input = {method: 'propagate', propType: 'approx', active: meta.idpRepr(false)};
    const outp = await this.makeCall(input);
    for (const s of meta.symbols) {
      for (const v of s.values) {
        const info = outp[s.idpname][v.idp.idpName];
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
    void this.doRelevance();
  }

  public async reset() {
    const meta = await this.meta;
    for (const s of meta.symbols) {
      for (const v of s.values) {
        v.reset();
      }
    }
    void this.doPropagation();
  }

  public async doRelevance() {
    const meta = await this.meta;
    const input = {method: 'relevance', active: meta.idpRepr(true)};
    const outp = await this.makeCall(input);
    for (const s of meta.symbols) {
      for (const v of s.values) {
        const info = outp[s.idpname][v.idp.idpName];
        v.relevant = info['ct'] || info['cf'];
      }
    }
  }

  public async explain(symbol: string, value: string): Promise<object> {
    const meta = await this.meta;
    const obj = meta.idpRepr(false);
    const vInfo = await this.getValueInfo(symbol, value);
    obj[symbol][value].ct = !vInfo.value;
    obj[symbol][value].cf = vInfo.value;

    const input = {method: 'explain', active: obj};
    const outp = await this.makeCall(input);
    const paramTree = this.toTree(outp);
    return paramTree;
  }

  public async getParams(symbol: string, value: string): Promise<object> {
    const obj = {};
    obj[symbol] = {};
    obj[symbol][value] = {cf: true};
    const input = {method: 'params', active: obj};
    const outp = await this.makeCall(input);
    const paramTree = this.toTree(outp);
    return paramTree;
  }

  private toTree(outp) {
    const paramTree = {};
    for (const key of Object.getOwnPropertyNames(outp)) {
      const current = outp[key];
      const valueList = [];
      for (const val of Object.getOwnPropertyNames(current)) {
        if (current[val].ct || current[val].cf) {
          valueList.push(val);
        }
      }
      if (valueList.length > 0) {
        paramTree[key] = valueList;
      }
    }
    return paramTree;
  }

  public async getValueInfo(symbol: string, value: string): Promise<ValueInfo> {
    const meta = await this.meta;
    return meta.symbols.filter(x => x.idpname === symbol)[0].values.filter(x => x.idp.idpName === value)[0];
  }

  public outProcedure(symbols: string[], input: object): string {
    return 'procedure out(){' +
      'output = {' + symbols.map(x => JSON.stringify(x)).join(',') + '}\n' +
      'li = [[' + JSON.stringify(input) + ']]' +
      '}';
  }

  private getMetaFile(): Observable<string> {
    return this.http.get(AppSettings.META_URL, {responseType: 'text'});
  }
}
