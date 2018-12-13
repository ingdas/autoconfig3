export interface SymbolInfo {
  idpname: string;
  type: string;
  priority: number;
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
