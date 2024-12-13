import { eg, input } from './input';
import { cleanAndParse, sumOf } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {};

type XY = { x: number; y: number };
type Machine = { A: XY, B: XY, Prize: XY };

function parseLine(line: string): XY {
  if (line.indexOf('X') > line.indexOf('Y')) {
    throw new Error('Expected X before Y');
  }
  const [x, y] = line.match(/\d+/g)!.map(Number);
  return { x, y };
}

function parseAll(data: string) {
  const lines = cleanAndParse(data);
  const len = lines.length;
  const machines: Machine[] = [];

  for (let i = 0; i < len; i += 4) {
    const A = parseLine(lines[i]);
    const B = parseLine(lines[i + 1]);
    const Prize = parseLine(lines[i + 2]);
    machines.push({ A, B, Prize });
  }

  return machines;
}

function solve(machine: Machine) {
  const { A, B, Prize } = machine;
  const bNumerator = A.y * Prize.x - A.x * Prize.y;
  const bDenominator = A.y * B.x - A.x * B.y;

  if (bDenominator === 0) {
    return { solved: false as const };
  }

  const b = bNumerator / bDenominator;
  const a = (Prize.x - B.x * b) / A.x;

  if (a !== Math.floor(a) || b !== Math.floor(b)) {
    return { solved: false as const };
  }

  return {
    solved: true as const,
    A: a,
    B: b
  };
}

function cost({ solved, A, B }: ReturnType<typeof solve>) {
  if (!solved) {
    return 0;
  }
  return A * 3 + B;
}

export function part1() {
  const machines = parseAll(input);
  const solutions = machines.map(solve);
  const costs = solutions.map(cost);
  return sumOf(costs);
}

export function part2() {
  const machines = parseAll(input);
  machines.forEach(machine => {
    machine.Prize.x += 10000000000000;
    machine.Prize.y += 10000000000000;
  });
  const solutions = machines.map(solve);
  const costs = solutions.map(cost);

  // console.log(costs);

  return sumOf(costs);
}

// export const answers = [
//   54601,
//   54078
// ];
