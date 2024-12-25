import { eg, input } from './input';
import { cleanAndParse, Coordinate, coordinates, MapValueOf, simpleRange, sumOf } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {
  manualStart: true,
};

const directions: [string, [number, number]][] = [
  ["<", [0, -1]],
  [">", [0, 1]],
  ["v", [1, 0]],
  ["^", [-1, 0]]
];

const numberKeySrc = `789
456
123
.0A`;

const directionKeySrc = `.^A
<v>`;

function parseKeySrc(src: string) {
  const grid = src.split('\n').map(l => Array.from(l));
  const height = grid.length;
  const width = grid[0].length;

  const keyPadMap = new Map<
    string,
    {
      coords: [number, number],
      next: Map<string, string>
    }
  >();

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const key = grid[row][col];

      if (key === '.') {
        continue;
      }

      const keyMap = new Map<string, string>();

      keyPadMap.set(key, {
        coords: [row, col],
        next: keyMap
      });

      for (const [dir, [dRow, dCol]] of directions) {
        const next = grid[row + dRow]?.[col + dCol] ?? '.';

        if (next !== '.') {
          keyMap.set(next, dir);
        }
      }
    }
  }

  return keyPadMap;
}
type Keypad = ReturnType<typeof parseKeySrc>;
type NextMap = MapValueOf<Keypad>['next'];

function keyPads() {
  return {
    numericKeypad: parseKeySrc(numberKeySrc),
    directionKeypad: parseKeySrc(directionKeySrc)
  };
}

function pathCache() {
  return new Map<string, string[][]>();
}
type PathCache = ReturnType<typeof pathCache>;
type PathList = MapValueOf<PathCache>;

function getPaths(cache: PathCache, keypad: Keypad, fromKey: string, toKey: string) {
  const cacheKey = `${fromKey}-${toKey}`;

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  const paths: PathList = [];
  const { coords: [sRow, sCol] } = keypad.get(fromKey)!;
  const { coords: [eRow, eCol] } = keypad.get(toKey)!;

  const directionWhitelist = new Set<string>();
  if (sRow > eRow) { directionWhitelist.add('^'); }
  if (sRow < eRow) { directionWhitelist.add('v'); }
  if (sCol > eCol) { directionWhitelist.add('<'); }
  if (sCol < eCol) { directionWhitelist.add('>'); }

  function next(key: string, path: string[]) {
    const basePath = [...path, key];
    if (key === toKey) {
      paths.push(basePath);
      return;
    }

    const { next: nextMap } = keypad.get(key)!;

    for (
      const nextKey of nextMap.keys()
    ) {
      if (path.includes(nextKey)) {
        continue;
      }

      const nextDirection = nextMap.get(nextKey)!;
      if (!directionWhitelist.has(nextDirection)) {
        continue;
      }

      next(nextKey, basePath);
    }
  }

  next(fromKey, []);

  const pathDirections = paths.map(
    path => [...path.slice(1).map(
      (p, i) => keypad.get(path[i])!.next.get(p)!
    ), 'A']
  );

  cache.set(
    cacheKey,
    pathDirections
  );

  return pathDirections;
}

function parseData(src: string) {
  const { directionKeypad, numericKeypad } = keyPads();

  const codes = cleanAndParse(src);
  const possiblePathCache = pathCache();

  return {
    src,
    codes,
    numericKeypad,
    directionKeypad,
    possiblePathCache
  };
}
type Parsed = ReturnType<typeof parseData>;

function listFullPaths(
  sequence: string[],
  keypad: Keypad,
  possiblePathCache: PathCache
) {
  let pos = 'A';

  // console.log(sequence);
  const parts: string[][][] = [];
  for (const key of sequence) {
    const paths = getPaths(possiblePathCache, keypad, pos, key);
    // console.log(pos, key, paths);
    parts.push(paths);
    pos = key;
  }

  // console.log(parts);
  const range = simpleRange(parts.map(p => p.length));

  const thesePaths = Array.from(coordinates(range)).map(
    coord => {
      const path = coord.flatMap(
        (c, i) => parts[i][c]
      )
      return path;
    }
  );

  return thesePaths;
}


export function part1() {
  const {
    codes,
    numericKeypad,
    directionKeypad,
    possiblePathCache
  } = parseData(input);

  // console.log(numberKeySrc);


  const values = codes.map(
    code => {
      const pad1 = listFullPaths(Array.from(code), numericKeypad, possiblePathCache);
      const pad2 = pad1.flatMap(p => listFullPaths(p, directionKeypad, possiblePathCache));
      const pad3 = pad2.flatMap(p => listFullPaths(p, directionKeypad, possiblePathCache));

      const min = pad3.reduce(
        (acc, p) => Math.min(acc, p.length),
        Number.MAX_SAFE_INTEGER
      );

      const val = parseInt(code, 10);

      console.log(min, val);
      return val * min;
    }
  );

  console.log(values);

  return sumOf(values);
}

export function part2() {
  /*

  Split it in to finding the best way to the next digit, one at a time
  Find a way of memoizing the best paths at each level?

  */
  return 2;
}

export const answers = [
  206798, // in 80 seconds, so now way for part 2
//   54078
];


