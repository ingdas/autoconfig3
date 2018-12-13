import {contains, forEach, remove} from 'typescript-collections/dist/lib/arrays';
import {Structure} from './structure';
import {Theory} from './theory';
import {isNumeric} from 'rxjs/util/isNumeric';

export class VarVal {
  constructor(
    public readonly idpname: string,
    public readonly name: string,
    public readonly shortdescription: string,
    public readonly longdescription: string,
    public readonly priority: number,
    public readonly showparameters: boolean,
  ) {
  }

  static readonly functionString = 'function'; // TODO: make these final?
  static readonly propositionString = 'proposition';
  static readonly predicateString = 'predicate';
  static readonly numString = 'numrange';
  static readonly dateString = 'daterange';
  static readonly implicitPost = '_implicit';
  static readonly valueString = 'value';
}

export abstract class Variable extends VarVal {
  constructor(
    idpname: string,
    name: string,
    shortdescription: string,
    longdescription: string,
    priority: number,
    showparameters: boolean,
    public readonly showoptimize: boolean,
  ) {
    super(idpname, name, shortdescription, longdescription, priority, showparameters);
  }

  abstract getType(): string; // returns the type of this class // TODO: fix hack
  abstract isUnknown(): boolean;

  abstract isRelevant(): boolean;

  public isVisible(visibilityLevel: number): boolean {
    if (visibilityLevel === 2 || this.priority < 2) {
      return true;
    }
    if (visibilityLevel === 1) {
      return this.isRelevant() || !this.isUnknown();
    }
    return false;
  }

  abstract isExplanationPart(): boolean;

  abstract isExplained(): boolean;

  public isImplicit(): boolean {
    return false;
  }

  abstract setAsExplained(s: string);

  abstract resetExplanation(): void;

  abstract hasZerolevelBound(bound: string);

  abstract getIdpQueryString(struc: string, table: string): string;

  abstract addIdpPropagateString(s1: Structure, s2: Structure): void;

  abstract addIdpExplainString(t1: Theory, s1: Structure, s2: Structure, s3: Structure): void;

  abstract addIdpParameterExplainString(s1: Structure, s: string): void;

  abstract parseIdpType(in_pt: string): void;

  abstract parseIdpPropagate(in_ct: string, in_cf: string, rel_cf: string, iszerolevel: boolean): void;

  abstract parseIdpExplanation(in_ct: string, in_cf: string): void;

  abstract parseIdpParameterExplanation(in_cf: string): void;

  static parseTable(s: string): string[] {
    var current = s.trim();
    current = current.slice(1, current.length - 1); // remove { ... }
    current = current.trim(); // remove whitespace

    var result: string[] = [];
    if (current != '') {
      result = current.split(';'); // split on ';'
      for (var i = 0; i < result.length; ++i) {
        result[i] = result[i].trim().replace(/\"+/g, ''); // remove quotes
      }
    }
    return result;
  }
}

export class Func extends Variable {
  values: string[] = [];
  relevants: string[] = [];

  /** choices by user **/
  chosenValues: string[] = [];
  forbiddenValues: string[] = [];

  /** consequences given by IDP not taking above choices into account **/
  ct: string[] = [];
  cf: string[] = [];
  /** values propagated before choices were made **/
  zerolevels: string[] = [];

  /** values of this function that were in the last requested explanation **/
  inExplanation: string[] = [];
  /** value of this function for which the last explanation was requested **/
  asExplained: string = '';

  constructor(i: string, n: string, s: string, l: string, p: number, sp: boolean, so: boolean) {
    super(i, n, s, l, p, sp, so);
  }

  isUnknown(): boolean {
    return this.chosenValues.length === 0 && this.forbiddenValues.length === 0 && this.ct.length === 0 && this.cf.length === 0;
  }

  isRelevant(): boolean {
    return this.relevants.length > 0;
  }

  isExplanationPart(): boolean {
    return this.inExplanation.length > 0;
  }

  isExplained(): boolean {
    return this.asExplained != '';
  }

  isRelevantVal(v: string): boolean {
    return contains(this.relevants, v);
  }

  getType(): string {
    return VarVal.functionString;
  }

  forbid(s: string): void {
    this.forbiddenValues.push(s);
  }

  choose(s: string): void {
    var stringUntillLastComma = '';
    for (var i = s.length - 1; i >= 0; --i) {
      if (s.charAt(i) === ',') {
        stringUntillLastComma = s.substring(0, i + 1);
        break;
      }
    }
    this.chosenValues = this.chosenValues.filter(v => !v.startsWith(stringUntillLastComma));
    this.chosenValues.push(s);
  }

  reset(s: string): void {
    remove(this.chosenValues, s);
    remove(this.forbiddenValues, s);
  }

  isTrue(s: string): boolean {
    return contains(this.chosenValues, s) || contains(this.ct, s);
  }

  isFalse(s: string): boolean {
    return contains(this.forbiddenValues, s) || contains(this.cf, s);
  }

  isKnown(s: string): boolean {
    return this.isTrue(s) || this.isFalse(s);
  }

  isChosen(s: string): boolean {
    return contains(this.chosenValues, s) || contains(this.forbiddenValues, s);
  }

  isPropagated(s: string): boolean {
    return this.isKnown(s) && !this.isChosen(s);
  };

  isInExplanation(s: string): boolean {
    return contains(this.inExplanation, s);
  }

  resetExplanation(): void {
    this.inExplanation = [];
    this.asExplained = '';
  }

  hasZerolevelBound(bound: string) {
    return contains(this.zerolevels, bound);
  }

  setAsExplained(s: string): void {
    this.asExplained = s;
  }

  addIdpPropagateString(s1: Structure, s2: Structure): void {
    s2.addInterpretation(this.idpname, this.chosenValues, true, false);
    s1.addInterpretation(this.idpname, this.forbiddenValues, false, false);
  }

  addIdpExplainString(t1: Theory, s1: Structure, s2: Structure, s3: Structure): void {
    if (this.asExplained != '') {
      s1.addInterpretation(this.idpname, [this.asExplained], this.isFalse(this.asExplained), false);
    }
    s2.addInterpretation(this.idpname, this.forbiddenValues, false, false);
    s3.addInterpretation(this.idpname, this.chosenValues, false, false);
  }

  addIdpParameterExplainString(s1: Structure, s: string): void {
    s1.addInterpretation(this.idpname, [s], false, false);
  }

  getIdpQueryString(struc: string, table: string): string {
    return 'print(' + struc + '[V.' + this.idpname + '].graph.' + table + ')\n';
  }

  parseIdpType(in_pt: string): void {
    let vals = Variable.parseTable(in_pt).sort();
    let numerals = vals.filter(s => isNumeric(s)).map(s => Number(s)).sort((a, b) => a - b);
    for (var i = 0; i < numerals.length; ++i) {
      let numerals_subset = vals.filter(s => Number(s) === numerals[i]);
      this.values = this.values.concat(numerals_subset);
      vals = vals.filter(s => Number(s) !== numerals[i]);
    }
    this.values = this.values.concat(vals);
    this.relevants = this.values;
  }

  parseIdpPropagate(in_ct: string, in_cf: string, rel_cf: string, iszerolevel: boolean): void {
    this.ct = Variable.parseTable(in_ct);
    this.cf = Variable.parseTable(in_cf);
    this.relevants = Variable.parseTable(rel_cf);
    if (iszerolevel) {
      this.zerolevels = this.ct.concat(this.cf);
    }
  }

  parseIdpExplanation(in_ct: string, in_cf: string): void {
    this.inExplanation = Variable.parseTable(in_ct).concat(Variable.parseTable(in_cf)).filter((s: string) => {
      return s != this.asExplained;
    });
  }

  parseIdpParameterExplanation(in_cf: string): void {
    this.inExplanation = Variable.parseTable(in_cf);
  }

  getValues(visibilityLevel: number): string[] {
    if (visibilityLevel === 2 || this.priority < 2) {
      return this.values;
    }
    if (visibilityLevel === 1) {
      return this.values.filter(x => this.isKnown(x) || contains(this.relevants, x));
    }
    return []; // visibilityLevel==='0' && this.priority>=2
  }
}

export class Proposition extends Variable {
  isrelevant: boolean = true;

  /** current 3-valued interpretation **/
  istrue: boolean = false;
  isfalse: boolean = false;

  /** whether it is chosen or not **/
  ischosen: boolean = false;
  /** whether the proposition is propagated before choices were made **/
  isZeroLevel: boolean = false;

  /** represents whether this boolean was in the last requested explanation **/
  inExplanation: boolean = false;
  /** represents whether this proposition was requested to be explained **/
  asExplained: boolean = false;

  constructor(i: string, n: string, s: string, l: string, p: number, sp: boolean) {
    super(i, n, s, l, p, sp, false);
  }

  isUnknown(): boolean {
    return !this.istrue && !this.isfalse;
  }

  isRelevant(): boolean {
    return this.isrelevant;
  }


  isExplanationPart(): boolean {
    return this.inExplanation;
  }

  isExplained(): boolean {
    return this.asExplained;
  }

  getType(): string {
    return VarVal.propositionString;
  }

  choose(): void {
    this.ischosen = true;
    this.istrue = true;
  }

  forbid(): void {
    this.ischosen = true;
    this.isfalse = true;
  }

  reset(): void {
    this.ischosen = false;
    this.isfalse = false;
    this.istrue = false;
  }

  isTrue(): boolean {
    return this.istrue;
  }

  isFalse(): boolean {
    return this.isfalse;
  }

  isKnown(): boolean {
    return this.isTrue() || this.isFalse();
  }

  isChosen(): boolean {
    return this.ischosen;
  }

  isPropagated(): boolean {
    return this.isKnown() && !this.isChosen();
  };

  resetExplanation(): void {
    this.inExplanation = false;
    this.asExplained = false;
  }

  hasZerolevelBound(bound: string) {
    return this.isZeroLevel;
  }

  setAsExplained(s: string): void {
    this.asExplained = true;
  }

  addIdpPropagateString(s1: Structure, s2: Structure): void {
    if (this.isChosen()) {
      s1.addInterpretation(this.idpname, ['()'], this.isTrue(), false);
    }
  }

  addIdpExplainString(t1: Theory, s1: Structure, s2: Structure, s3: Structure): void {
    if (this.asExplained) {
      s1.addInterpretation(this.idpname, ['()'], this.isFalse(), false);
    }
    if (this.ischosen) {
      (this.isTrue() ? s3 : s2).addInterpretation(this.idpname, ['()'], false, false);
    }
  }

  addIdpParameterExplainString(s1: Structure, s: string): void {
    s1.addInterpretation(this.idpname, ['()'], false, false);
  }

  getIdpQueryString(struc: string, table: string): string {
    return 'print(' + struc + '[V.' + this.idpname + '].' + table + ')\n';
  }

  parseIdpType(in_pt: string): void {
  }

  parseIdpPropagate(in_ct: string, in_cf: string, rel_cf: string, iszerolevel: boolean): void {
    this.istrue = (in_ct === 'true');
    this.isfalse = (in_cf === 'true');
    this.isrelevant = rel_cf === 'true';
    if (iszerolevel) {
      this.isZeroLevel = this.isTrue() || this.isFalse();
    }
  }

  parseIdpExplanation(ct: string, cf: string): void {
    this.inExplanation = (ct === 'true' || cf === 'true') && !this.asExplained;
  }

  parseIdpParameterExplanation(in_cf: string): void {
    this.inExplanation = in_cf === 'true';
  }
}

export class Predicate extends Variable {
  implicit: boolean = false;

  public isImplicit(): boolean {
    return this.implicit;
  }

  values: string[] = [];

  relevants: string[] = [];

  /** choices by user **/
  chosenValues: string[] = [];
  forbiddenValues: string[] = [];

  /** consequences given by IDP not taking above choices into account **/
  ct: string[] = [];
  cf: string[] = [];
  /** values propagated before choices were made **/
  zerolevels: string[] = [];

  /** values of this predicate that were in the last requested explanation **/
  inExplanation: string[] = [];
  /** value of this predicate for which an explanation was requested **/
  asExplained: string = '';

  constructor(i: string, n: string, s: string, l: string, p: number, impl: boolean, sp: boolean) {
    super(i, n, s, l, p, sp, false);
    this.implicit = impl;
  }

  isUnknown(): boolean {
    return this.chosenValues.length === 0 && this.forbiddenValues.length === 0 && this.ct.length === 0 && this.cf.length === 0;
  }

  isRelevant(): boolean {
    return this.relevants.length > 0;
  }

  isRelevantVal(v: string): boolean {
    return contains(this.relevants, v);
  }

  isExplanationPart(): boolean {
    return this.inExplanation.length > 0;
  }

  isExplained(): boolean {
    return this.asExplained != '';
  }

  getType(): string {
    return VarVal.predicateString;
  }

  forbid(s: string): void {
    this.forbiddenValues.push(s);
  }

  choose(s: string): void {
    this.chosenValues.push(s);
  }

  reset(s: string): void {
    remove(this.chosenValues, s);
    remove(this.forbiddenValues, s);
  }

  isTrue(s: string): boolean {
    return contains(this.chosenValues, s) || contains(this.ct, s);
  }

  isFalse(s: string): boolean {
    return contains(this.forbiddenValues, s) || contains(this.cf, s);
  }

  isKnown(s: string): boolean {
    return this.isTrue(s) || this.isFalse(s);
  }

  isChosen(s: string): boolean {
    return contains(this.chosenValues, s) || contains(this.forbiddenValues, s);
  }

  isPropagated(s: string): boolean {
    return this.isKnown(s) && !this.isChosen(s);
  };

  isInExplanation(s: string): boolean {
    return contains(this.inExplanation, s);
  }

  resetExplanation(): void {
    this.inExplanation = [];
    this.asExplained = '';
  }

  hasZerolevelBound(bound: string) {
    return contains(this.zerolevels, bound);
  }

  setAsExplained(s: string): void {
    this.asExplained = s;
  }

  addIdpPropagateString(s1: Structure, s2: Structure): void {
    s1.addInterpretation(this.idpname, this.chosenValues, true, false);
    s1.addInterpretation(this.idpname, this.forbiddenValues, false, false);
  }

  addIdpExplainString(t1: Theory, s1: Structure, s2: Structure, s3: Structure): void {
    if (this.asExplained != '') {
      s1.addInterpretation(this.idpname, [this.asExplained], this.isFalse(this.asExplained), false);
    }
    s2.addInterpretation(this.idpname, this.forbiddenValues, false, false);
    s3.addInterpretation(this.idpname, this.chosenValues, false, false);
  }

  addIdpParameterExplainString(s1: Structure, s: string): void {
    s1.addInterpretation(this.idpname, [s], false, false);
  }

  getIdpQueryString(struc: string, table: string): string {
    return 'print(' + struc + '[V.' + this.idpname + '].' + table + ')\n';
  }

  parseIdpType(in_pt: string): void {
    let vals = Variable.parseTable(in_pt).sort();
    let numerals = vals.filter(s => isNumeric(s)).map(s => Number(s)).sort((a, b) => a - b);
    for (var i = 0; i < numerals.length; ++i) {
      let numerals_subset = vals.filter(s => Number(s) === numerals[i]);
      this.values = this.values.concat(numerals_subset);
      vals = vals.filter(s => Number(s) !== numerals[i]);
    }
    this.values = this.values.concat(vals);
    this.relevants = this.values;
  }

  parseIdpPropagate(in_ct: string, in_cf: string, rel_cf: string, iszerolevel: boolean): void {
    this.ct = Variable.parseTable(in_ct);
    this.cf = Variable.parseTable(in_cf);
    this.relevants = Variable.parseTable(rel_cf);
    if (iszerolevel) {
      this.zerolevels = this.ct.concat(this.cf);
      if (this.isImplicit()) {
        this.chosenValues = this.values;
      }
    }
  }

  parseIdpExplanation(in_ct: string, in_cf: string): void {
    this.inExplanation = Variable.parseTable(in_ct).concat(Variable.parseTable(in_cf)).filter((s: string) => {
      return s != this.asExplained;
    });
  }

  parseIdpParameterExplanation(in_cf: string): void {
    this.inExplanation = Variable.parseTable(in_cf);
  }

  getValues(visibilityLevel: number): string[] {
    if (visibilityLevel === 2 || this.priority < 2) {
      return this.values;
    }
    if (visibilityLevel === 1) {
      return this.values.filter(x => this.isKnown(x) || contains(this.relevants, x));
    }
    return []; // visibilityLevel==='0' && this.priority>=2
  }
}

type rangeval = string;

export class Range extends Variable {

  static numcompare: (a: rangeval, b: rangeval) => number = (a, b) => {
    if (Number(a) > Number(b)) return 1;
    if (Number(a) < Number(b)) return -1;
    return 0;
  };

  static datecompare: (a: rangeval, b: rangeval) => number = (a, b) => {
    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
  };

  compare: (a: rangeval, b: rangeval) => number = null;
  type: string = '';

  values: rangeval[] = [];
  relevants: rangeval[] = [];

  /** choice by user **/
  chosen: rangeval = null;

  /** consequences given by IDP not taking above choices into account (bound)**/
  public propagated: { [bound: string]: rangeval } = {'lower': null, 'upper': null};
  /** values propagated before choices were made **/
  zerolevelPropagated: { [bound: string]: rangeval } = {'lower': null, 'upper': null};

  /** whether the chosen value of this constant is in the last requested explanation **/
  inExplanation: boolean = false;
  /** value of this constant for which the last explanation was requested (bound)**/
  asExplained: string = null; // bound

  public enteredValue: rangeval = '';

  constructor(i: string, n: string, s: string, l: string, p: number, type: string, sp: boolean, so: boolean) {
    super(i, n, s, l, p, sp, so);
    this.type = type;
    if (type === VarVal.dateString) {
      this.compare = Range.datecompare;
    } else if (type === VarVal.numString) {
      this.compare = Range.numcompare;
    }
  }

  isUnknown(): boolean {
    return this.chosen === null && (this.propagated['lower'] === null || this.propagated['lower'] === this.values[0]) && this.propagated['upper'] === null;
  }

  isRelevant(): boolean {
    return this.relevants.length > 0;
  }

  isExplanationPart(): boolean {
    return this.inExplanation;
  }

  isExplained(): boolean {
    return this.asExplained != null;
  }

  getType(): string {
    return this.type;
  }

  reset(): void {
    this.chosen = null;
    this.propagated['lower'] = null;
    this.propagated['upper'] = null;
  }

  resetEnteredValue() {
    this.enteredValue = '';
  }

  readEnteredValue(): void {
    this.chosen = null;
    if (this.enteredValue === '' || this.enteredValue === null) {
      return;
    }
    for (var i = 0; i < this.values.length; ++i) {
      if (this.compare(this.values[i], this.enteredValue) <= 0) {
        this.chosen = this.values[i];
      } else {
        break;
      }
    }
  }

  hasValidEnteredValue(): boolean {
    return this.enteredValue === null || this.enteredValue === '' || (
      (this.propagated['lower'] === null || this.compare(this.propagated['lower'], this.enteredValue) <= 0) &&
      (this.propagated['upper'] === null || this.compare(this.propagated['upper'], this.enteredValue) > 0));
  }

  hasPropagated(bound: string): boolean {
    return this.propagated[bound] != null;
  }

  hasAsExplained(bound: string): boolean {
    return this.asExplained === bound;
  }

  setAsExplained(bound: string): void {
    this.asExplained = bound;
  }

  resetExplanation(): void {
    this.inExplanation = false;
    this.asExplained = null;
  }

  hasZerolevelBound(bound: string) {
    return this.zerolevelPropagated[bound] !== null && this.zerolevelPropagated[bound] === this.propagated[bound];
  }

  addIdpPropagateString(s1: Structure, s2: Structure): void {
    if (this.chosen != null) {
      s2.addInterpretation(this.idpname, [this.chosen], true, this.getType() === VarVal.dateString);
    }
  }

  addIdpExplainString(t1: Theory, s1: Structure, s2: Structure, s3: Structure): void {
    if (this.asExplained === 'lower') {
      t1.addLine(this.idpname + '<' + (this.getType() === VarVal.dateString ? '\"' : '') + this.propagated['lower'] + (this.getType() === VarVal.dateString ? '\"' : '') + '.');
    }
    if (this.asExplained === 'upper') {
      t1.addLine(this.idpname + '>=' + (this.getType() === VarVal.dateString ? '\"' : '') + this.propagated['upper'] + (this.getType() === VarVal.dateString ? '\"' : '') + '.');
    }
    if (this.chosen != null && this.asExplained === null) {
      s3.addInterpretation(this.idpname, [this.chosen], false, this.getType() === VarVal.dateString);
    }
  }

  addIdpParameterExplainString(s1: Structure, s: string): void {
    s1.addInterpretation(this.idpname, [this.values[0]], true, this.getType() === VarVal.dateString);
  }

  getIdpQueryString(struc: string, table: string): string {
    return 'print(' + struc + '[V.' + this.idpname + '].graph.' + table + ')\n';
  }

  parseIdpType(in_pt: string): void {
    this.values = Variable.parseTable(in_pt).sort(this.compare);
    this.reset();
  }

  parseIdpPropagate(in_ct: string, in_cf: string, rel_cf: string, iszerolevel: boolean): void {
    this.propagated['lower'] = null;
    var cf = Variable.parseTable(in_cf);
    for (var i = 0; i < this.values.length; ++i) {
      if (!contains(cf, this.values[i])) {
        this.propagated['lower'] = this.values[i];
        break;
      }
    }
    this.propagated['upper'] = null;
    for (var i = this.values.length - 1; i >= 0; --i) {
      if (!contains(cf, this.values[i])) {
        break;
      }
      this.propagated['upper'] = this.values[i];
    }
    this.relevants = Variable.parseTable(rel_cf);
    if (iszerolevel) {
      this.zerolevelPropagated['lower'] = this.propagated['lower'];
      this.zerolevelPropagated['upper'] = this.propagated['upper'];
    }
  }

  parseIdpExplanation(in_ct: string, in_cf: string): void {
    var allExplValues = Variable.parseTable(in_ct).concat(Variable.parseTable(in_cf));
    this.inExplanation = contains(allExplValues, this.chosen);
  }

  parseIdpParameterExplanation(in_cf: string): void {
    var allExplValues = Variable.parseTable(in_cf).filter(s => this.values.includes(s));
    this.inExplanation = allExplValues.length > 0;
  }
}

// TODO: how to simplify html?
// TODO: write out limitations of system: - relevance is not 100% accurate for constants and functions - no gaps allowed in NumRange - ?
// TODO: relevance on literals?
// TODO: warnings uitzetten?
