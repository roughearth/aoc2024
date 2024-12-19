import { eg, eg2, input } from './input';
import { cleanAndParse, neighbours } from '../../utils';
import { Day } from '..';
import { dijkstraFrom } from '../../utils/dijkstra';
import { parse } from 'path';
import { aStarFrom } from '../../utils/a-star';

export const meta: Day['meta'] = {
  manualStart: true,
};

// 0,1,2,3 rotate clockwise is +1%4, anti-clockwise is +3%4
const directions = [
  [-1, 0], // N: 0
  [0, 1], // E: 1
  [1, 0], // S: 2
  [0, -1]  // W: 3
];

function key(row: number, col: number, dir: number): number {
  // return JSON.stringify([row, col, dir]);
  return dir + 10 * col + 10_000 * row;
}

function parseKey(key: number): number[] {
  // return JSON.parse(`${key}`);
  const dir = key % 10;
  const col = Math.floor(key / 10) % 1000;
  const row = Math.floor(key / 10_000);

  return [row, col, dir];
}

function parseGrid(data: string) {
  const grid = cleanAndParse(
    data.replace(/[SE]/g, '.'),
    l => Array.from(l)
  );
  const width = grid[0].length;
  const height = grid.length;

  // they just are, by inspection
  const start = key(height - 2, 1, 1);
  const end = [1, width - 2];

  return { grid, width, height, start, end };
}

const nextEdges = (node: number, grid: string[][]) => {
  const [row, col, dir] = parseKey(node);

  const edges: [number, number][] = [];
  const right = (dir + 1) % 4;
  const left = (dir + 3) % 4;

  const [dRtRow, dRtCol] = directions[right];
  const [dLtRow, dLtCol] = directions[left];

  const [rtRow, rtCol] = [row + dRtRow, col + dRtCol];
  const [ltRow, ltCol] = [row + dLtRow, col + dLtCol];

  if (grid[rtRow][rtCol] === '.') {
    edges.push([key(row, col, (dir + 1) % 4), 1000]); // turn right
  }
  if (grid[ltRow][ltCol] === '.') {
    edges.push([key(row, col, (dir + 3) % 4), 1000]); // turn left
  };

  const [dr, dc] = directions[dir];
  let [nRow, nCol] = [row + dr, col + dc];

  if (grid[nRow][nCol] === '.') {
    edges.push([key(nRow, nCol, dir), 1]);
  }
  // while (grid[nRow][nCol] === '.' && grid[nRow + dRtRow][nCol + dRtCol] === '#' && grid[nRow + dLtRow][nCol + dLtCol] === '#') {
  //   nRow += dr;
  //   nCol += dc;
  // }
  // // nRow -= dr;
  // // nCol -= dc;

  // if (nRow !== row || nCol !== col) {
  //   edges.push([key(nRow, nCol, dir), Math.max(Math.abs(nRow - row), Math.abs(nCol - col))]);
  // }

  return edges;
}

const isEnd = (node: number, end: number[]) => {
  const [tRow, tCol] = end;
  const [nRow, nEnd] = parseKey(node);

  return tRow === nRow && tCol === nEnd;
};

export function part1() {
  const { grid, start, end } = parseGrid(input);

  const graph = aStarFrom(
    start,
    (node: number) => nextEdges(node, grid),
    (node: number) => {
      const [row, col] = parseKey(node);
      const [tRow, tCol] = end;

      return Math.abs(tRow - row) + Math.abs(tCol - col);
    },
    (n: number) => isEnd(n, end)
  );

  const [, best] = graph.find();

  return best;
}

export function part2() {
  const { grid, start, end } = parseGrid(input);

  const graphFromStart = dijkstraFrom(start, (node: number) => nextEdges(node, grid));
  const [, best] = graphFromStart.find((n: number) => isEnd(n, end));


  const found = new Set<string>();
  for (const [node, costFromStart, pathFromStart] of graphFromStart) {
    if (costFromStart <= best) {
      console.log(costFromStart);

      const graphFromHere = dijkstraFrom(
        node,
        (node: number) => nextEdges(node, grid),
        { maxCost: best - costFromStart }
      );

      const aStarFromHere = aStarFrom(
        node,
        (node: number) => nextEdges(node, grid),
        (node: number) => {
          const [row, col] = parseKey(node);
          const [tRow, tCol] = end;

          return Math.abs(tRow - row) + Math.abs(tCol - col);
        },
        (n: number) => isEnd(n, end)
      );


      try {
        const [, costFromHere, pathFromHere] = aStarFromHere.find();

        if (costFromHere + costFromStart === best) {
          [...pathFromStart, ...pathFromHere].forEach(n => {
            const [row, col] = parseKey(n);
            found.add(`${row},${col}`);
          });
        }
      } catch (e) { }
    }
  }

  return found.size;
}

export const answers = [
  99460,
  // 461 too low (1 best path)
  // 560 too high (length of best path given by part 1)
];
