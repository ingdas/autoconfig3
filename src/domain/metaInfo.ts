import {AppSettings} from '../services/AppSettings';
import {InputMetaInfo, InputSymbolInfo, InputValueInfo} from './inputmeta';

export class SymbolInfo {
  idpname: string;
  type: string;
  priority: number;
  showParameters: boolean;
  showOptimize: boolean;
  isImplicit: boolean;
  guiname: string;
  shortinfo?: string;
  longinfo?: string;
  values: ValueInfo[];

  static fromInput(inp: InputSymbolInfo): SymbolInfo {
    const out = new SymbolInfo();
    out.idpname = inp.idpname;
    out.type = inp.type;
    out.priority = inp.priority === 'core' ? 0 : 2;
    out.showParameters = inp.showParameters || false;
    out.showOptimize = inp.showOptimize || false;
    out.isImplicit = inp.showParameters || false;
    out.guiname = inp.guiname || inp.idpname;
    out.shortinfo = inp.shortinfo;
    out.longinfo = inp.longinfo;
    out.values = [];
    return out;
  }

  idpRepr(all: boolean): Object {
    const out = {};
    out[this.idpname] = this.values.map(x => x.idpRepr(all)).reduce((a, b) => {
      return {...a, ...b};
    });
    return out;
  }
}

export class ValueInfo {
  constructor(public idpname: string[]) {
  }

  get known(): boolean {
    return this.value !== null;
  }

  shortinfo?: string;
  longinfo?: string;
  propagated = false;
  relevant = true;
  value = null;

  static fromInput(inp: InputValueInfo): ValueInfo {
    const out = new ValueInfo([inp.idpname]);
    out.shortinfo = inp.shortinfo;
    out.longinfo = inp.longinfo;
    return out;
  }

  idpRepr(all: boolean): Object {
    const out = {};
    out[JSON.stringify(this.idpname)] = {
      'ct': this.value === true && (all || !this.propagated),
      'cf': this.value === false && (all || !this.propagated)
    };
    return out;
  }
}

export class MetaInfo {

  symbols: SymbolInfo[];
  values: ValueInfo[];

  title: string;
  timeout: number;

  static fromInput(inp: InputMetaInfo): MetaInfo {
    const out = new MetaInfo();
    out.title = inp.title || AppSettings.DEFAULT_TITLE;
    out.timeout = inp.timeout || AppSettings.DEFAULT_TIMEOUT;
    out.symbols = inp.symbols.map(SymbolInfo.fromInput);
    out.values = inp.values.map(ValueInfo.fromInput);
    return out;
  }

  idpRepr(all: boolean): Object {
    return this.symbols.map(x => x.idpRepr(all)).reduce((a, b) => {
      return {...a, ...b};
    });
  }

  makeValueInfo(o: string[]): ValueInfo {
    if (o.length === 1) {
      const moreInfo = this.values.filter(x => x.idpname[0] === o[0]);
      if (moreInfo.length > 0) {
        return moreInfo[0];
      }
    }
    return new ValueInfo(o);
  }
}
