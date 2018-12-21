import {AppSettings} from '../services/AppSettings';
import {InputMetaInfo, InputSymbolInfo, InputValueInfo} from './inputmeta';
import {Relevance} from '../model/Relevance';
import {Visibility} from '../model/Visibility';

export class CurrentAssignment {
  propagated = false;
  relevant = true;
  value = null;
  symbolName: string;
  valueName: string;

  idpRepr(all: boolean): Object {
    return {
      'ct': this.value === true && (all || !this.propagated),
      'cf': this.value === false && (all || !this.propagated)
    };
  }

  reset() {
    this.propagated = false;
    this.value = null;
  }

  get known(): boolean {
    return this.value !== null;
  }
}

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

  private static allButLastEqual(idpNames: string[], idpNames2: string[]): boolean {
    for (let i = 0; i < idpNames.length - 1; i++) {
      if (idpNames[i] !== idpNames2[i]) {
        return false;
      }
    }
    const out = idpNames[idpNames.length - 1] !== idpNames2[idpNames.length - 1];
    return out;
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

  functionConsistency(a: CurrentAssignment) {
    if (this.type !== 'function' && this.type !== 'numrange') {
      return;
    }
    const lookFor = this.getValue(a.valueName);
    for (const v of this.values) {
      if (SymbolInfo.allButLastEqual(v.idp.idpNames, lookFor.idp.idpNames)) {
        if (v.assignment.value) {
          v.assignment.value = null;
        }
      }
    }
  }

  getValue(name: string) {
    return this.values.filter(x => x.idp.idpName === name)[0];
  }

  get relevant() {
    return this.values.some(x => x.assignment.relevant);
  }

  get known() {
    return this.values.some(x => x.assignment.known);
  }


  makeValueInfo(o: string[]): ValueInfo {
    const out = new ValueInfo(new IDPTuple(o), this.idpname);

    const moreInfo = this.values.filter(x => JSON.stringify(o) === x.idp.guiName);
    if (moreInfo.length > 0) {
      out.shortinfo = moreInfo[0].shortinfo;
      out.longinfo = moreInfo[0].longinfo;
    }
    return out;
  }

  idpRepr(all: boolean): Object {
    const out = {};
    out[this.idpname] = this.values.filter(v => v.assignment.known).map(x => x.idpRepr(all)).reduce((a, b) => {
      return {...a, ...b};
    }, {});
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
  assignment: CurrentAssignment = new CurrentAssignment();

  constructor(public idp: IDPTuple, symbolName: string) {
    this.assignment.symbolName = symbolName;
    this.assignment.valueName = idp.idpName;
  }

  static fromInput(inp: InputValueInfo): ValueInfo {
    const out = new ValueInfo(new IDPTuple([inp.idpname]), 'INPUT VALUE INFO');
    out.shortinfo = inp.shortinfo;
    out.longinfo = inp.longinfo;
    return out;
  }

  idpRepr(all: boolean): Object {
    const out = {};
    out[this.idp.idpName] = this.assignment.idpRepr(all);
    return out;
  }
}

export class MetaInfo {

  symbols: SymbolInfo[];
  values: ValueInfo[];

  title: string;
  timeout: number;
  visibility: Visibility = AppSettings.DEFAULT_VISIBILITY;
  relevance: Relevance = AppSettings.DEFAULT_RELEVANCE;

  static fromInput(inp: InputMetaInfo): MetaInfo {
    const out = new MetaInfo();
    out.title = inp.title || AppSettings.DEFAULT_TITLE;
    out.timeout = inp.timeout || AppSettings.DEFAULT_TIMEOUT;
    out.symbols = inp.symbols.map(SymbolInfo.fromInput);
    out.values = inp.values.map(ValueInfo.fromInput);
    return out;
  }

  idpRepr(all: boolean): Object {
    return this.symbols.filter(x => x.values.some(v => v.assignment.known))
      .map(x => x.idpRepr(all)).reduce((a, b) => {
        return {...a, ...b};
      }, {});
  }

  functionConsistency(a: CurrentAssignment) {
    this.symbols.filter(x => x.idpname == a.symbolName).forEach(x => x.functionConsistency(a));
  }
}
