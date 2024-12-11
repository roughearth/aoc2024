export function generateArray<T>(length: number, generate: (i: number) => T): T[] {
  return Array.from(
    { length },
    (_, i) => generate(i)
  );
}

export function chunk<T>(a: T[], size: number): T[][] {
  return a.flatMap((_, i, a) => (i % size) ? [] : [a.slice(i, i + size)]);
}

export function sumOf(a: number[]): number {
  return a.reduce((total, entry) => total + entry, 0);
}

export function mappedSumOf<T>(a: T[], map: (i: T) => number) {
  return a.reduce((total, entry) => total + map(entry), 0);
}

export function productOf(a: number[], map: (i: any) => number = i => i): number {
  return a.reduce((a, b) => map(a) * map(b), 1);
}

export function findBest<T>(a: T[], scoreFn: (i: T) => number): [T, number] {
  return <[T, number]>a.reduce(
    (t: [T | undefined, number], current) => {
      const [best, max] = t;

      const score = scoreFn(current);
      if (!best || (score > max)) {
        return [current, score];
      }
      return [best, max];
    },
    [undefined, Number.MIN_SAFE_INTEGER]
  )
}
