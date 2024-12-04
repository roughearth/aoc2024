import { eg, input } from './input';
import { cleanAndParse, CoordinateRange, coordinates, neighbours, simpleRange } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {};

function xmasesAt(grid: string[][], range: CoordinateRange, row: number, col: number) {
  const cell = grid[row][col];

  let found = 0;

  if (cell === 'X') {
    for (const [nr, nc] of neighbours([row, col], range)) {
      if (grid[nr][nc] === 'M') {
        const dr = nr - row;
        const dc = nc - col;

        if ((grid[nr + dr]?.[nc + dc] === 'A') && (grid[nr + 2 * dr]?.[nc + 2 * dc] === 'S')) {
          found++;
        }
      }
    }
  }

  return found;
}
type Counter = typeof xmasesAt;

function masXesAt(grid: string[][], range: CoordinateRange, row: number, col: number) {
  const cell = grid[row][col];

  let found = 0;

  if (cell === 'A') {
    if (testMasX(grid, row, col)) {
      found++;
    }
  }

  return found;
}

function testMasX(grid: string[][], row: number, col: number) {
  const corners = [[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([dr, dc]) => grid[row + dr]?.[col + dc]).join('');
  const valid = [
    'MMSS',
    'SSMM',
    'MSMS',
    'SMSM'
  ]

  return valid.includes(corners);
}

export function doPart(data: string, counter: Counter) {
  const grid = cleanAndParse(data, l => Array.from(l));
  let ans = 0;

  const height = grid.length;
  const width = grid[0].length;

  const range = simpleRange([height, width]);

  for (const [row, col] of coordinates(range)) {
    ans += counter(grid, range, row, col);
  }

  return ans;
}

export function part1() {
  return doPart(input, xmasesAt);
}

export function part2() {
  return doPart(input, masXesAt);
}

export const answers = [
  2462,
  1877
];
