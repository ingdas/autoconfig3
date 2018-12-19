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
  meta: Promise<MetaInfo>;
  private spec: Promise<string>;

  constructor(
    private http: HttpClient,
    private settings: ConfigurationService
  ) {
    this.spec = this.http.get(AppSettings.SPECIFICATION_URL, {responseType: 'text'}).toPromise();
    this.meta = this.getMeta();
    this.meta.then(x => {
      void this.doPropagation();
      this.syncSettings();
    });
  }

  public callIDP(call: RemoteIdpCall): Observable<RemoteIdpResponse> {
    this.openCalls++;
    const out = this.http.post<RemoteIdpResponse>(AppSettings.IDP_ENDPOINT, JSON.stringify(call));
    out.subscribe(x => this.openCalls--);
    return out;
  }

  public async syncSettings() {
    const meta = await this.meta;
    this.settings.relevance.subscribe(x => meta.relevance = x);
    this.settings.relevance.subscribe(x => this.doRelevance());
    this.settings.visibility.subscribe(x => meta.visibility = x);
  }

  private async getOptions(meta: MetaInfo) {
    const input = {method: 'init', active: []};
    const opts = await this.makeCall(meta, input);
    for (const symb of meta.symbols) {
      for (const v of opts[symb.idpname]) {
        symb.values.push(symb.makeValueInfo(v));
      }
    }
  }

  public async makeCall(meta: MetaInfo, input: Object, extra: string = ''): Promise<object> {
    const symbols = meta.symbols.map(x => x.idpname);
    const spec = await this.spec;
    const outProc = await this.outProcedure(meta, symbols, input);
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
    const meta = await this.meta;
    const input = {method: 'propagate', propType: 'exact', active: meta.idpRepr(false)};
    const outp = await this.makeCall(meta, input);
    this.applyPropagation(meta, outp);
    void this.doRelevance();
  }

  public async optimise(symbol: string, minimize: boolean) {
    const meta = await this.meta;
    const extraline = 'term t : V { sum{:true:' + (minimize ? '' : '-') + symbol + '}}';
    const input = {method: 'minimize', propType: 'approx', active: meta.idpRepr(false)};
    const outp = await this.makeCall(meta, input, extraline);
    this.applyPropagation(meta, outp);
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
        }
      }
    }
  }

  public async reset() {
    const meta = await this.meta;
    for (const s of meta.symbols) {
      for (const v of s.values) {
        v.assignment.reset();
      }
    }
    void this.doPropagation();
  }

  public async doRelevance() {
    const meta = await this.meta;
    const input = {method: 'relevance', active: meta.idpRepr(true)};
    const outp = await this.makeCall(meta, input);
    for (const s of meta.symbols) {
      for (const v of s.values) {
        const info = outp[s.idpname][v.idp.idpName];
        v.assignment.relevant = info['ct'] || info['cf'];
      }
    }
  }

  public async explain(symbol: string, value: string): Promise<object> {
    const meta = await this.meta;
    const obj = meta.idpRepr(false);
    const vInfo = await this.getValueInfo(symbol, value);
    obj[symbol][value].ct = !vInfo.assignment.value;
    obj[symbol][value].cf = vInfo.assignment.value;

    const input = {method: 'explain', active: obj};
    const outp = await this.makeCall(meta, input);
    const paramTree = this.toTree(outp);
    return paramTree;
  }

  public async getParams(symbol: string, value: string): Promise<object> {
    const meta = await this.meta;
    const obj = {};
    obj[symbol] = {};
    obj[symbol][value] = {cf: true};
    const input = {method: 'params', active: obj};
    const outp = await this.makeCall(meta, input);
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

  public async getValueInfo(symbol: string, value: string): Promise<ValueInfo> {
    const meta = await this.meta;
    return meta.symbols.filter(x => x.idpname === symbol)[0].values.filter(x => x.idp.idpName === value)[0];
  }

  public async outProcedure(meta: MetaInfo, symbols: string[], input: object): Promise<string> {
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
