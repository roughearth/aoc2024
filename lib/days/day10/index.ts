import { eg, input } from './input';
import { cleanAndParse, Coordinate, CoordinateRange, orthogonalNeighbours, simpleRange } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {};

function parseMap(data: string) {
  const zeroes: Coordinate[] = [];
  const grid = cleanAndParse(data, (l, r) => {
    const row = Array.from(l).map((h, c) => {
      if (h === '0') {
        zeroes.push([r, c]);
      }
      return parseInt(h, 10);
    });
    return row;
  });

  const range = simpleRange([grid.length, grid[0].length]);

  return { grid, range, zeroes };
}

function findNext(height: number, cells: Coordinate[], grid: number[][], range: CoordinateRange) {
  const nextSet = new Set<string>();
  const next: Coordinate[] = [];
  for (const centre of cells) {
    for (const [r, c] of orthogonalNeighbours(centre, range)) {
      if (grid[r][c] === height) {
        nextSet.add(`${r}, ${c}`);
        next.push([r, c]);
      }
    }
  }

  const pt1 = Array.from(nextSet).map(
    s => s.split(',').map(n => parseInt(n, 10)) as Coordinate
  );

  return { pt1, pt2: next }
}

type Next = ReturnType<typeof findNext>;

function doPart<T extends keyof Next>(data: string, part: T) {
  const { grid, range, zeroes } = parseMap(input);

  let total = 0;

  for (const head of zeroes) {
    let next: Next[T] = [head];
    for (let h = 1; h <= 9; h++) {
      ({ [part]: next } = findNext(h, next, grid, range));
    }
    total += next.length;
  }

  return total;
}

export function part1() {
  return doPart(input, 'pt1');
}

export function part2() {
  return doPart(input, 'pt2');
}

export const answers = [
  796,
  1942
];
