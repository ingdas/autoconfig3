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

  get relevant() {
    return this.values.some(x => x.relevant);
  }

  get known() {
    return this.values.some(x => x.known);
  }

  static fromInput(inp: InputSymbolInfo): SymbolInfo {
    const out = new SymbolInfo();
    out.idpname = inp.idpname;
    out.type = inp.type;
    out.priority = inp.priority === 'core' ? 0 : 2;
    out.showParameters = inp.showParameters || false;
    out.showOptimize = inp.showOptimize || false;
    out.isImplicit = inp.isImplicit || false;
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

export class IDPTuple {
  public guiName: string;

  constructor(public idpNames: string[]) {
    this.guiName = idpNames.join(',');
  }

  get idpName(): string {
    return JSON.stringify(this.idpNames);
  }
}

export class ValueInfo {
  shortinfo?: string;
  longinfo?: string;
  propagated = false;
  relevant = true;
  value = null;

  constructor(public idp: IDPTuple) {
  }

  get known(): boolean {
    return this.value !== null;
  }

  static fromInput(inp: InputValueInfo): ValueInfo {
    const out = new ValueInfo(new IDPTuple([inp.idpname]));
    out.shortinfo = inp.shortinfo;
    out.longinfo = inp.longinfo;
    return out;
  }

  idpRepr(all: boolean): Object {
    const out = {};
    out[this.idp.idpName] = {
      'ct': this.value === true && (all || !this.propagated),
      'cf': this.value === false && (all || !this.propagated)
    };
    return out;
  }

  reset() {
    this.propagated = false;
    this.relevant = true;
    this.value = null;
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
    const moreInfo = this.values.filter(x => o.join(',') === x.idp.guiName);
    if (moreInfo.length > 0) {
      return moreInfo[0];
    }
    return new ValueInfo(new IDPTuple(o));
  }
}
