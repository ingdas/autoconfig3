// These interfaces are used as scheme for the CSV
export interface InputSymbolInfo {
  idpname: string;
  type: string;
  priority?: string;
  showParameters?: boolean;
  showOptimize?: boolean;
  isImplicit?: boolean;
  guiname?: string;
  shortinfo?: string;
  longinfo?: string;
}

export interface InputValueInfo {
  idpname: string;
  shortinfo?: string;
  longinfo?: string;
}

export interface InputMetaInfo {
  symbols: InputSymbolInfo[];
  values: InputValueInfo[];

  title: string;
  timeout: number;
}
