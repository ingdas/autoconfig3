import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {RemoteIdpCall, RemoteIdpResponse} from '../domain/remote-data';
import {AppSettings} from './AppSettings';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {MetaInfo, ValueInfo} from '../domain/metaInfo';
import {ConfigurationService} from './configuration.service';
import {Relevance} from '../model/Relevance';

@Injectable()
export class IdpService {

  openCalls = 0;
  meta: MetaInfo = null;
  private spec: string = null;

  public ready(): boolean {
    return (this.meta !== null) && (this.spec !== null);
  }

  constructor(
    private http: HttpClient,
    private settings: ConfigurationService
  ) {
    this.http.get(AppSettings.SPECIFICATION_URL, {responseType: 'text'}).toPromise().then(
      x => {
        this.getMeta().then(x => {
          this.meta = x;
          void this.doPropagation();
          this.syncSettings();
        });
        this.spec = x;
      }
    );

  }

  public callIDP(call: RemoteIdpCall): Observable<RemoteIdpResponse> {
    this.openCalls++;
    const out = this.http.post<RemoteIdpResponse>(AppSettings.IDP_ENDPOINT, JSON.stringify(call));
    out.subscribe(x => this.openCalls--);
    return out;
  }

  public async syncSettings() {
    this.settings.relevance.subscribe(x => this.meta.relevance = x);
    this.settings.relevance.subscribe(x => this.doRelevance());
    this.settings.visibility.subscribe(x => this.meta.visibility = x);
  }

  private async getOptions(meta: MetaInfo) {
    const input = {method: 'init', active: []};
    const opts = await this.makeCall(meta, input);
    for (const symb of meta.symbols) {
      if (!opts[symb.idpname]) {
        console.log('Unknown Idpname: ', symb.idpname);
        continue;
      }
      for (const v of opts[symb.idpname]) {
        symb.values.push(symb.makeValueInfo(v));
      }
    }
  }

  public async makeCall(meta: MetaInfo, input: Object, extra: string = ''): Promise<object> {
    const symbols = meta.symbols.map(x => x.idpname);
    const spec = this.spec;
    const outProc = this.outProcedure(meta, symbols, input);
    const code = 'include "config.idp"\n' + spec + outProc + '\n' + extra;
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
    const input = {method: 'propagate', propType: 'exact', active: this.meta.idpRepr(false)};
    const outp = await this.makeCall(this.meta, input);
    this.applyPropagation(this.meta, outp);
    void this.doRelevance();
  }

  public async optimise(symbol: string, minimize: boolean) {
    const extraline = 'term t : V { sum{:true:' + (minimize ? '' : '-') + symbol + '}}';
    const input = {method: 'minimize', propType: 'approx', active: this.meta.idpRepr(false)};
    const outp = await this.makeCall(this.meta, input, extraline);
    this.applyPropagation(this.meta, outp);
  }

  public async mx() {
    const input = {method: 'modelexpand', active: this.meta.idpRepr(false)};
    const outp = await this.makeCall(this.meta, input);
    this.applyPropagation(this.meta, outp);
  }

  private applyPropagation(meta: MetaInfo, outp: object) {
    for (const s of meta.symbols) {
      for (const v of s.values) {
        const info = outp[s.idpname][v.idp.idpName];
        // Value Found
        if ((info['ct'] || info['cf'])) {
          // It is a propagation if it had no value
          if (v.assignment.value === null) {
            v.assignment.propagated = true;
          }
          v.assignment.value = info['ct'];
        } else if (v.assignment.propagated) {
          // No Value: Reset state
          v.assignment.value = null;
          v.assignment.propagated = false;
          v.assignment.relevant = true;
        }
      }
    }
  }

  public async reset() {
    for (const s of this.meta.symbols) {
      for (const v of s.values) {
        v.assignment.reset();
      }
    }
    void this.doPropagation();
  }

  public async doRelevance() {
    const input = {method: 'relevance', active: this.meta.idpRepr(true)};
    const outp = await this.makeCall(this.meta, input);
    for (const s of this.meta.symbols) {
      for (const v of s.values) {
        const info = outp[s.idpname][v.idp.idpName];
        v.assignment.relevant = info['ct'] || info['cf'];
      }
    }
  }

  public async explain(symbol: string, value: string): Promise<object> {
    const obj = this.meta.idpRepr(false);
    const vInfo = this.getValueInfo(symbol, value);
    obj[symbol][value].ct = !vInfo.assignment.value;
    obj[symbol][value].cf = vInfo.assignment.value;

    const input = {method: 'explain', active: obj};
    const outp = await this.makeCall(this.meta, input);
    const paramTree = this.toTree(outp);
    return paramTree;
  }

  public async getParams(symbol: string, value: string): Promise<object> {
    const obj = {};
    obj[symbol] = {};
    obj[symbol][value] = {cf: true};
    const input = {method: 'params', active: obj};
    const outp = await this.makeCall(this.meta, input);
    const paramTree = this.toTree(outp);
    return paramTree;
  }

  private toTree(outp: object) {
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

  public getValueInfo(symbol: string, value: string): ValueInfo {
    return this.meta.symbols.filter(x => x.idpname === symbol)[0].values.filter(x => x.idp.idpName === value)[0];
  }

  public outProcedure(meta: MetaInfo, symbols: string[], input: object): string {
    return 'procedure out(){' +
      'output = {' + symbols.map(x => JSON.stringify(x)).join(',') + '}\n' +
      'li = [[' + JSON.stringify(input) + ']]\n' +
      'stdoptions.justifiedrelevance =' + (meta.relevance === Relevance.JUSTIFIED ? 'true' : 'false') + '\n' +
      '}';
  }

  private async getMeta(): Promise<MetaInfo> {
    const str = await this.http.get(AppSettings.META_URL, {responseType: 'text'}).toPromise();
    const meta = MetaInfo.fromInput(JSON.parse(str));
    await this.getOptions(meta);
    return meta;
  }
}
