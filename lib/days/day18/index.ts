import { eg, input } from './input';
import { cleanAndParse, orthogonalNeighbours, simpleRange } from '../../utils';
import { Day } from '..';
import { dijkstraFrom } from '../../utils/dijkstra';

export const meta: Day['meta'] = {
  manualStart: false,
};

function parseInput(data: string) {
  const bytes = cleanAndParse(data, l => l.split(',').map(Number));
  const real = bytes.some(([a]) => a > 10);
  const size = real ? 70 : 6;
  const limit = real ? 1024 : 12;
  const range = simpleRange([size + 1, size + 1]);
  return { bytes, size, limit, range };
}

export function run({ bytes, size, limit, range }: ReturnType<typeof parseInput>) {
  const fallen = new Set<string>(
    bytes.slice(0, limit).map(([x, y]) => `${x},${y}`)
  );

  const dj = dijkstraFrom("0,0", n => {
    const [x, y] = n.split(',').map(Number);
    const next: [string, number][] = [];
    for (const [dx, dy] of orthogonalNeighbours([x, y], range)) {
      if (!fallen.has(`${dx},${dy}`)) {
        next.push([`${dx},${dy}`, 1]);
      }
    }
    return next;
  });

  try {
    const [, steps] = dj.find(n => n === `${size},${size}`);

    return steps;
  }
  catch (e) {
    return "Failed";
  }
}

export function part1() {
  const { bytes, size, limit, range } = parseInput(input);

  return run({ bytes, size, limit, range });
}

function bisect(start: number, end: number, fn: (n: number) => boolean) {
  let count = 0;
  while (start < end) {
    count++;
    const mid = Math.floor((start + end) / 2);
    if (fn(mid)) {
      end = mid;
    } else {
      start = mid + 1;
    }
  }

  return [start - 1, count]; // not sure where the -1 comes from!
}

export function part2() {
  const { bytes, limit: start } = parseInput(input);

  const len = bytes.length - 1;

  const [res] = bisect(start, len, n => {
    const { bytes, size, range } = parseInput(input);
    const result = run({ bytes, size, limit: n, range });
    return result === "Failed";
  });

  return bytes[res].join(',');
}

export const answers = [
  334,
  "20,12"
];
