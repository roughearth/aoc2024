import { eg, input } from './input';
import { cleanAndParse, orthogonalNeighbours } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {};

function parseData(data: string) {
  let start: number[] = [];
  let end: number[] = [];

  const grid = cleanAndParse(
    data,
    (l, row) => Array.from(l).map(
      (c, col) => {
        if (c === 'S') {
          start = [row, col];
          return '.';
        }
        if (c === 'E') {
          end = [row, col];
          return '.';
        }
        return c;
      }
    )
  );

  const height = grid.length;
  const width = grid[0].length;

  return {
    grid,
    height,
    width,
    start,
    end
  };
}

function key(row: number, col: number) {
  return `${row},${col}`;
}

type Key = ReturnType<typeof key>;

function listPath(data: ReturnType<typeof parseData>) {
  const { grid, height, width, start, end } = data;
  const path: number[][] = [];
  const visited = new Set<Key>();

  const queue = [start];

  while (queue.length) {
    if (queue.length !== 1) {
      throw new Error('Not a single path');
    }
    const [row, col] = queue.pop()!;
    const k = key(row, col);
    visited.add(k);
    path.push([row, col]);

    for (const [nr, nc] of orthogonalNeighbours([row, col])) {
      const nk = key(nr, nc);
      if (!visited.has(nk) && grid[nr][nc] === '.') {
        queue.push([nr, nc]);
      }
    }
  }

  return path;
}

function timeMap(path: number[][]) {
  const time = new Map<Key, number>();
  let t = 0;
  for (const [r, c] of path) {
    time.set(key(r, c), t++);
  }
  return time;
}

function countCheats(source: string, radius: number, minCheat: number) {
  const data = parseData(source);
  const path = listPath(data);
  const times = timeMap(path);

  const diffs: number[][] = [];

  // make a manhattan circle
  for (let dr = -radius; dr <= radius; dr++) {
    const max = radius - Math.abs(dr);
    for (let dc = -max; dc <= max; dc++) {
      if (dr === 0 && dc === 0) {
        continue;
      }
      diffs.push([dr, dc]);
    }
  }

  let found = new Set<string>();

  for (const [r, c] of path) {
    for (const [dr, dc] of diffs) {
      const nr = r + dr;
      const nc = c + dc;
      const nk = key(nr, nc);
      const here = times.get(key(r, c))!;

      if (times.has(nk)) {
        const t = times.get(nk)!;
        const tDiff = t - here;
        const mann = Math.abs(dr) + Math.abs(dc);

        if (tDiff >= (minCheat + mann)) {
          found.add([r, c, nr, nc].join(','));
        }
      }
    }
  }

  return found.size;
}

export function part1() {
  return countCheats(input, 2, 100);
}

export function part2() {
  return countCheats(input, 20, 100);
}

export const answers = [
  1323,
  983905
];
