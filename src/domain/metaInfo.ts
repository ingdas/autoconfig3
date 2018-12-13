export class SymbolInfo {
  constructor(
    public idpname: string,
    public type: string,
    public priority: number,
    public showParameters: boolean,
    public showOptimize: boolean,
    public guiname: string,
    public shortinfo?: string,
    public longinfo?: string,
  ) {
  }
}

export class AppInfo {
  public symbols: SymbolInfo[];
  public values: SymbolInfo[];

  public title: string;
  public timeout: number;

}
