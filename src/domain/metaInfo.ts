import {AppSettings} from '../services/AppSettings';

export interface SymbolInfo {
  idpname: string;
  type: string;
  priority: string;
  showParameters: boolean;
  showOptimize: boolean;
  isImplicit: boolean;
  guiname: string;
  shortinfo?: string;
  longinfo?: string;
}

export interface ValueInfo {
  idpname: string;
  shortinfo?: string;
  longinfo?: string;
}

export interface MetaInfo {
  symbols: SymbolInfo[];
  values: ValueInfo[];

  title: string;
  timeout: number;
}

export class UISettings {
  visibilityLevel: number = AppSettings.DEFAULT_VISIBILITY;
  justifiedRelevance: boolean = AppSettings.DEFAULT_JUSTIFIEDRELEVANCE;
}
