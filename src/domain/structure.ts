export class Structure {
  private interpretations: string = '';

  constructor(
    public name: string,
    public voc: string,
    public types: string
  ) {
  }

  addInterpretation(symb: string, tuples: string[], polarity: boolean, asString: boolean): void {
    this.interpretations += symb + '<c' + (polarity ? 't' : 'f') + '>={';
    tuples.forEach(t => this.interpretations += (asString ? '\"' : '') + t + (asString ? '\"' : '') + ';');
    this.interpretations += '}\n';
  }

  getIdpCode(): string {
    return 'structure ' + this.name + ':' + this.voc + '{\n' + this.types + '\n' + this.interpretations + '}\n';
  }
}
