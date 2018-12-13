export class Theory {
  private content: string = '';

  constructor(
    public name: string,
    public voc: string
  ) {
  }

  addLine(l: string): void {
    this.content += l + '\n';
  }

  getIdpCode(): string {
    return 'theory ' + this.name + ':' + this.voc + '{\n' + this.content + '}\n';
  }
}
