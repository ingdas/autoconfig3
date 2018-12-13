interface SymbolInfo {
  idpname: string;
  type: string;
  priority: number;
  showParameters: boolean;
  showOptimize: boolean;
  guiname: string;
  shortinfo?: string;
  longinfo?: string;
}

interface AppInfo {
  symbols: SymbolInfo[];
  values: SymbolInfo[];

  title: string;
  timeout: number;
}
