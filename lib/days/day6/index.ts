import { eg, input } from './input';
import { cleanAndParse } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {
  manualStart: false
};

const [UP, RIGHT, DOWN, LEFT] = [0, 1, 2, 3];

function parseGrid(data: string) {
  const guard = { row: -1, col: -1, dir: UP };
  const grid = cleanAndParse(data, (l, row) => Array.from(l).map((c, col) => {
    if (c === '^') {
      guard.row = row;
      guard.col = col;
    };

    return { row, col, blocked: c === '#', visited: false, directions: new Array<number>() };
  }));

  const size = { width: grid[0].length, height: grid.length };

  return { grid, guard, size };
}
type Parsed = ReturnType<typeof parseGrid>;
type Guard = Parsed['guard'];
type Grid = Parsed['grid'];
type Cell = Grid[number][number];
type Size = Parsed['size'];

function rotateDirection(dir: number) {
  return (dir + 1) % 4;
}

function guardLoopCheck(guard: Guard) {
  return guard.row * 10_000 + guard.col * 10 + guard.dir;
}

function moveGuard(grid: Grid, size: Size, guard: Guard, extraBlock?: [number, number], loopCheck?: Set<number>) {
  const cell = grid[guard.row][guard.col];
  cell.visited = true;
  cell.directions.push(guard.dir);

  let nextRow = guard.row;
  let nextCol = guard.col;

  if (guard.dir === UP) {
    nextRow -= 1;
  }
  if (guard.dir === RIGHT) {
    nextCol += 1;
  }
  if (guard.dir === DOWN) {
    nextRow += 1;
  }
  if (guard.dir === LEFT) {
    nextCol -= 1;
  }

  if ((nextCol < 0) || (nextRow < 0) || (nextCol >= size.width) || (nextRow >= size.height)) {
    return "exit";
  }

  if (grid[nextRow][nextCol].blocked || ((nextRow === extraBlock?.[0]) && (nextCol === extraBlock?.[1]))) {
    guard.dir = rotateDirection(guard.dir);
    return "turned";
  }

  guard.row = nextRow;
  guard.col = nextCol;

  if (loopCheck) {
    const check = guardLoopCheck(guard);
    if (loopCheck.has(check)) {
      return "looped";
    }

    loopCheck.add(check);
  }


  return "moved";
}

export function part1() {
  const { grid, guard, size } = parseGrid(input);

  while (moveGuard(grid, size, guard) !== "exit") {
    //noop
  }

  let count = 0;

  for (let r = 0; r < size.height; r++) {
    for (let c = 0; c < size.width; c++) {
      if (grid[r][c].visited === true) {
        count++;
      }
    }
  }

  return count;
}

function guardKey(guard: Guard) {
  return `${guard.row},${guard.col}`;
}

export function part2() {
  const { grid, guard, size } = parseGrid(input);
  const { row: initRow, col: initCol, dir: initDir } = guard;

  let move: string;

  const history = new Set([guardKey(guard)]);

  do {
    move = moveGuard(grid, size, guard);
    history.add(guardKey(guard));
  }
  while (move !== "exit");

  let count = 0;

  for (const key of history) {
    const [row, col] = key.split(',').map(Number);

    const loopCheck = new Set<number>();
    guard.row = initRow;
    guard.col = initCol;
    guard.dir = initDir;

    do {
      move = moveGuard(grid, size, guard, [row, col], loopCheck);
      if (move === "looped") {
        count++
      }
    }
    while (move !== "exit" && move !== "looped");
  }

  return count;
}

export const answers = [
  4988,
  1697 // 1.5sec
];
