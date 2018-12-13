export class Theory {
  constructor(
    public name: string,
    public voc: string
  ) {
  }

  private content: string = '';

  addLine(l: string): void {
    this.content += l + '\n';
  }

  getIdpCode(): string {
    return 'theory ' + this.name + ':' + this.voc + '{\n' + this.content + '}\n';
  }
}
