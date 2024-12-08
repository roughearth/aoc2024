import { eg, input } from './input';
import { cleanAndParse, Coordinate, pairs } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {};

function parseData(data: string) {
  const byFreq = new Map<string, Coordinate[]>();
  const grid = cleanAndParse(data, (s, row) => {
    const cells = s.split('');

    for (let col = 0; col < cells.length; col++) {
      const cell = cells[col];
      if (cell !== '.') {
        if (!byFreq.has(cell)) {
          byFreq.set(cell, []);
        }
        byFreq.get(cell)!.push([row, col]);
      }
    }

    return Array(cells.length).fill(false);
  });

  return { grid, byFreq };
};

// returns a success flag
function setNode(grid: boolean[][], row: number, col: number) {
  if (row in grid && col in grid[row]) {
    grid[row][col] = true;
    return true;
  }
  return false;
}

function countNodes(grid: boolean[][]) {
  let count = 0;
  for (const row of grid) {
    for (const cell of row) {
      if (cell) {
        count++;
      }
    }
  }

  return count;
}

export function part1() {
  const { grid, byFreq } = parseData(input);

  for (const [type, coords] of byFreq.entries()) {
    for (const [i, j] of pairs(coords.length)) {
      const [rowa, cola] = coords[i];
      const [rowb, colb] = coords[j];

      const rowDiff = rowb - rowa;
      const colDiff = colb - cola;

      setNode(grid, rowa - rowDiff, cola - colDiff);
      setNode(grid, rowb + rowDiff, colb + colDiff);
    }
  }

  return countNodes(grid);
}

export function part2() {
  const { grid, byFreq } = parseData(input);

  for (const [type, coords] of byFreq.entries()) {
    // pairs() is empty unless there are at least 2 items
    for (const [i, j] of pairs(coords.length)) {
      const [rowa, cola] = coords[i];
      const [rowb, colb] = coords[j];

      const rowDiff = rowb - rowa;
      const colDiff = colb - cola;

      // the antennae themselves
      setNode(grid, rowa, cola);
      setNode(grid, rowb, colb);

      let downMul = 1;
      let upMul = 1;

      while (setNode(grid, rowa - rowDiff * downMul, cola - colDiff * downMul)) {
        downMul++;
      }

      while (setNode(grid, rowa + rowDiff * upMul, cola + colDiff * upMul)) {
        upMul++;
      }
    }
  }

  return countNodes(grid);
}

export const answers = [
  359,
  1293
];
