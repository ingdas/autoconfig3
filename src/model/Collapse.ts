export const enum Collapse {
  ALL,
  POSSIBLE,
  CERTAIN
}

export function toCollapse(collapse: Collapse): number {
  switch (collapse) {
    case Collapse.ALL:
      return 0;
    case Collapse.POSSIBLE:
      return 1;
    case Collapse.CERTAIN:
      return 2;
  }
}
