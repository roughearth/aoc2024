import { eg, input } from './input';
import { cleanAndParse, coordinates, simpleRange } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {};

const size = 5;
const fullRow = '#'.repeat(size);
const emptyRow = '.'.repeat(size);

function block(b: string) {
  const isKey = b.startsWith(emptyRow);
  const block = cleanAndParse(b, l => Array.from(l));

  if (!isKey) {
    block.reverse();
  }

  const heights = Array(size).fill(0);

  for (let c = 0; c < size; c++) {
    for (let r = 1; r < size + 1; r++) {
      if (block[r][c] === '#') {
        heights[c]++;
      }
    }
  }

  return { isKey, heights };
}
type Block = ReturnType<typeof block>;

function parse(input: string) {
  const blocks = cleanAndParse(input, block, { separator: '\n\n' });
  const locks: Block[] = [];
  const keys = blocks.filter(b => {
    if (b.isKey) {
      return true;
    } else {
      locks.push(b);
      return false;
    }
  });

  return { blocks, locks, keys };
}

function overlaps(a: Block, b: Block) {
  for (let i = 0; i < size; i++) {
    if (a.heights[i] + b.heights[i] > size) {
      return true;
    }
  }
  return false;
}

export function part1() {
  const { locks, keys } = parse(input);

  const range = simpleRange([keys.length, locks.length]);

  let potential = 0;

  for (const [k, l] of coordinates(range)) {
    if (!overlaps(keys[k], locks[l])) {
      potential++;
    }
  }

  return potential;
}

export function part2() {
  return "Merry Xmas!";
}

// export const answers = [
//   54601,
//   54078
// ];
