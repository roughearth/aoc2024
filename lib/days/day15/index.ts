import { eg1, eg2, eg3, input } from './input';
import { cleanAndParse, Coordinate, CoordinateRange, simpleRange } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {
  // manualStart: true
};

function parseInput(data: string, part: 1 | 2) {
  let robot: Coordinate = [];
  const expand = part === 2 && data.includes('O');
  const lines = cleanAndParse(data);
  const sep = lines.indexOf('');
  const warehouse = lines.slice(0, sep).map((l, row) => {
    if (expand) {
      l = l
        .replaceAll('#', '##')
        .replaceAll('O', '[]')
        .replaceAll('.', '..')
        .replaceAll('@', '@.');
    }

    const col = l.indexOf('@');
    if (col !== -1) {
      robot = [row, col];
    }
    return Array.from(l.replace('@', '.'));
  });
  const moves = Array.from(lines.slice(sep).join(''));

  return { robot, warehouse, moves };
}

const deltas: Record<string, number[]> = {
  '^': [-1, 0],
  'v': [1, 0],
  '<': [0, -1],
  '>': [0, 1]
};


function canMovePt1(row: number, col: number, dir: string, grid: string[][]) {
  const [dRow, dCol] = deltas[dir];
  const newRow = row + dRow;
  const newCol = col + dCol;

  const next = grid[newRow][newCol];

  if (next === '#') {
    return false;
  }
  if (next === '.') {
    return true;
  }
  return canMovePt1(newRow, newCol, dir, grid);
}

function canMovePt2(cells: number[][], grid: string[][], dir: string) {
  const [dRow] = deltas[dir];

  if (dRow === 0) {
    if (cells.length !== 1) {
      throw new Error('Invalid cells');
    }
    const [row, col] = cells[0];
    return canMovePt1(row, col, dir, grid);
  }
  else {
    const adjacent: number[][] = [];

    for (const [row, col] of cells) {
      const newRow = row + dRow;
      adjacent.push([newRow, col]);
    }

    if (adjacent.some(([row, col]) => grid[row][col] === '#')) {
      return false;
    }

    if (adjacent.every(([row, col]) => grid[row][col] === '.')) {
      return true;
    }

    const nextCells = new Set<string>();

    for (const [row, col] of adjacent) {
      const nextCell = grid[row][col];

      if (nextCell !== '.') {
        nextCells.add(`${row},${col}`);
      }
      if (nextCell === '[') {
        nextCells.add(`${row},${col + 1}`);
      }
      else if (nextCell === ']') {
        nextCells.add(`${row},${col - 1}`);
      }
    }

    return canMovePt2(
      Array.from(nextCells).map(c => c.split(',').map(Number)),
      grid,
      dir
    );
  }
}

function moveRobotPt1(robot: number[], dir: string, grid: string[][]) {
  const [row, col] = robot;
  const [dRow, dCol] = deltas[dir];

  let nextRow = row + dRow;
  let nextCol = col + dCol;

  robot[0] = nextRow;
  robot[1] = nextCol;

  while (grid[nextRow][nextCol] === 'O') {
    nextRow += dRow;
    nextCol += dCol;
  }

  grid[nextRow][nextCol] = 'O';
  grid[robot[0]][robot[1]] = '.';
}

function moveRobotPt2(robot: number[], dir: string, grid: string[][]) {
  const [dRow, dCol] = deltas[dir];
  const [row, col] = robot;

  if (dRow === 0) {
    let nextCol = col + dCol;

    robot[1] = nextCol;

    while (grid[row][nextCol] !== '.') {
      nextCol += dCol;
    }

    grid[row].splice(nextCol, 1);
    grid[row].splice(robot[1], 0, '.');
  }
  else {
    let currentSet = new Set<string>([`${row},${col}`]);
    const toMove: string[] = [];

    let N = 100;
    let nextRow = row;
    robot[0] = nextRow + dRow;

    while (N-- && currentSet.size > 0) {
      const nextSet = new Set<string>();
      nextRow += dRow;


      for (const cell of currentSet) {
        const [r, c] = cell.split(',').map(Number);
        const val = grid[nextRow][c];

        if (val !== '.') {
          nextSet.add(`${nextRow},${c}`);
        }
        if (val === '[') {
          nextSet.add(`${nextRow},${c + 1}`);
        }
        else if (val === ']') {
          nextSet.add(`${nextRow},${c - 1}`);
        }
      }

      toMove.push(...nextSet);
      currentSet = nextSet;
    }

    const valMap = new Map<string, string>();
    toMove.forEach(coord => {
      const [r, c] = coord.split(',').map(Number);
      valMap.set(coord, grid[r][c]);
      grid[r][c] = '.';
    });
    toMove.forEach(coord => {
      const [r, c] = coord.split(',').map(Number);
      grid[r + dRow][c] = valMap.get(coord)!;
    });
  }
}

function visualize(grid: string[][], robot: number[], note = '') {
  const vizGrid = [...grid];
  const lead = ''.padStart(note.length + 2, ' ');

  vizGrid[robot[0]] = [
    ...grid[robot[0]].slice(0, robot[1]),
    '@',
    ...grid[robot[0]].slice(robot[1] + 1)
  ];

  return vizGrid.map((row, i) => {
    const t = (i > 0) ? lead : `${note}: `;
    return `${t}${row.join('')}`;
  }).join('\n');
}

function gpsScore(grid: string[][]) {
  let score = 0;

  const width = grid[0].length;
  const height = grid.length;

  for (let row = 0; row < height; row++) {
    for (let col = 0; col < width; col++) {
      if (['O', '['].includes(grid[row][col])) {
        score += (100 * row) + col;
      }
    }
  }

  return score;
}

export function part1() {
  const { robot, warehouse, moves } = parseInput(input, 1);

  for (const move of moves) {
    if (canMovePt1(robot[0], robot[1], move, warehouse)) {
      moveRobotPt1(robot, move, warehouse);
    }
  }

  return gpsScore(warehouse);
}

export function part2() {
  const { robot, warehouse, moves } = parseInput(input, 2);

  for (const move of moves) {
    let success = false;
    if (canMovePt2([robot], warehouse, move)) {
      moveRobotPt2(robot, move, warehouse);
      success = true;
    }
  }

  return gpsScore(warehouse);
}

export const answers = [
  1442192,
  1448458
];
