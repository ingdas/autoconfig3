import {AppSettings} from '../services/AppSettings';
import {InputMetaInfo, InputSymbolInfo, InputValueInfo} from './inputmeta';
import {EventEmitter} from '@angular/core';

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

  static fromInput(inp: InputSymbolInfo): SymbolInfo {
    const out = new SymbolInfo();
    out.idpname = inp.idpname;
    out.type = inp.type;
    out.priority = inp.priority === 'core' ? 0 : 2;
    out.showParameters = inp.showParameters || false;
    out.showOptimize = inp.showParameters || false;
    out.isImplicit = inp.showParameters || false;
    out.guiname = inp.guiname || inp.idpname;
    out.shortinfo = inp.shortinfo;
    out.longinfo = inp.longinfo;
    return out;
  }
}

export class ValueInfo {
  idpname: string;
  shortinfo?: string;
  longinfo?: string;

  static fromInput(inp: InputValueInfo): ValueInfo {
    const out = new ValueInfo();
    out.idpname = inp.idpname;
    out.shortinfo = inp.shortinfo;
    out.longinfo = inp.longinfo;
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
}

export class UISettings {
  visibilityLevelEM: EventEmitter<number> = new EventEmitter();
  visibilityLevel: number = AppSettings.DEFAULT_VISIBILITY;

  justifiedRelevanceEM: EventEmitter<boolean> = new EventEmitter();
  justifiedRelevance: boolean = AppSettings.DEFAULT_JUSTIFIEDRELEVANCE;
}
