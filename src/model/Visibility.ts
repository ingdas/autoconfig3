export const enum Visibility {
  CORE,
  RELEVANT,
  ALL
}

export function toPriority(visibility: Visibility): number {
  switch (visibility) {
    case Visibility.CORE:
      return 0;
    case Visibility.RELEVANT:
      return 1;
    case Visibility.ALL:
      return 2;
  }
}
