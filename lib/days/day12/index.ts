import { eg, eg1, eg2, eg3, eg4, input } from './input';
import { cleanAndParse, Coordinate, coordinates, mappedSumOf, MapValueOf, orthogonalNeighbours, simpleRange, sumOf } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {
  manualStart: false,
};

function keyOf(coord: Coordinate) {
  return coord.join(',');
}

function getType([row, col]: Coordinate, grid: string[][]) {
  return grid[row][col];
}

function parseData(data: string) {
  const rawGrid = cleanAndParse(data, l => Array.from(l));

  const range = simpleRange([rawGrid.length, rawGrid[0].length]);
  const unvisited = new Map<string, {
    type: string,
    neighbours: string[],
    left: boolean,
    right: boolean,
    coord: Coordinate
  }>();

  for (const coord of coordinates(range)) {
    const key = keyOf(coord);
    const baseType = getType(coord, rawGrid);
    const neighbours = Array.from(orthogonalNeighbours(coord, range))
      .filter(c => getType(c, rawGrid) === baseType)
      .map(keyOf);

    const [r, c] = coord;
    const row = rawGrid[r];
    const left = row[c - 1] !== baseType;
    const right = row[c + 1] !== baseType;

    unvisited.set(key, { type: baseType, neighbours, left, right, coord });
  }
  return { unvisited };
}
type Unvisited = ReturnType<typeof parseData>['unvisited'];
type UnvisitedData = MapValueOf<Unvisited>;

function nextUnvisited(unvisited: Unvisited) {
  return unvisited.keys().next().value;
}

function newRegion(type: string) {
  return {
    type,
    perimeter: 0,
    area: 0,
    cells: [] as string[],
    data: [] as UnvisitedData[],
  };
}
type Region = ReturnType<typeof newRegion>;

function addToRegion(region: Region, coord: string, data: UnvisitedData) {
  region.cells.push(coord);
  region.data.push(data);
  region.area++;
  region.perimeter += (4 - data.neighbours.length);
}

function parseDataToRegions(data: string) {
  const { unvisited } = parseData(data);
  const regions: Region[] = [];

  while (unvisited.size > 0) {
    const next = nextUnvisited(unvisited)!;

    const queue = [next];
    const info = unvisited.get(next)!;

    const region = newRegion(info.type);
    regions.push(region);

    while (queue.length > 0) {
      const coord = queue.pop()!;
      const { neighbours } = unvisited.get(coord)!;
      const data = unvisited.get(coord)!;

      unvisited.delete(coord);

      addToRegion(region, coord, data);

      for (const neighbour of neighbours) {
        if (unvisited.has(neighbour) && !queue.includes(neighbour)) {
          queue.push(neighbour);
        }
      }
    }
  }

  return { regions };
}

export function part1() {
  const { regions } = parseDataToRegions(input);
  return mappedSumOf(regions, r => (r.area * r.perimeter));
}

function perimeterPart2({ data }: Region) {
  const leftMap = new Map<number, number[]>();
  const rightMap = new Map<number, number[]>();

  for (const { coord: [row, col], left, right } of data) {
    if (left) {
      if (!leftMap.has(col)) {
        leftMap.set(col, []);
      }
      leftMap.get(col)!.push(row);
    }

    if (right) {
      if (!rightMap.has(col)) {
        rightMap.set(col, []);
      }
      rightMap.get(col)!.push(row);
    }
  }

  const lists = [...leftMap.values(), ...rightMap.values()];

  let perimeter = lists.length;

  lists.forEach(list => {
    list.sort((a, b) => a - b);

    for (let i = 1; i < list.length; i++) {
      if (list[i] - list[i - 1] > 1) {
        perimeter += 1;
      }
    }
  });

  return perimeter * 2;
}

export function part2() {
  const { regions } = parseDataToRegions(input);

  return mappedSumOf(regions, region => {
    const perimeter2 = perimeterPart2(region);
    const { area } = region;

    return area * perimeter2;
  });
}

export const answers = [
  1434856,
  891106
];
