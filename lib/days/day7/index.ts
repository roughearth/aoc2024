import { eg, input } from './input';
import { cleanAndParse } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {
  manualStart: false,
};

function parseData(data: string) {
  return cleanAndParse(data, l => {
    const [target, rest] = l.split(': ');
    const numbers = rest.split(" ").map(n => parseInt(n, 10));
    return {
      target: parseInt(target, 10),
      numbers
    };
  });
}

function tryCalc(numbers: number[], ops: number, opCount: number, len: number) {
  return numbers.reduce((acc, n, i) => {
    const op = ops % opCount;
    ops = Math.floor(ops / opCount);

    if (op === 1) {
      return acc + n;
    }
    if (op === 2) {
      const s = Math.ceil(Math.log10(n + 1));
      return (acc * (10 ** s)) + n;
    }
    return acc * n;
  });
}

export function doPart(opCount: number, dataIn: string) {
  const data = parseData(dataIn);

  const found: number[] = [];

  loop:
  for (const { target, numbers } of data) {
    const len = numbers.length - 1;
    const ops = opCount ** len;

    for (let i = 0; i < ops; i++) {
      if (target === tryCalc(numbers, i, opCount, len)) {
        found.push(target);
        continue loop;
      }
    }
  }

  return found.reduce((acc, n) => acc + n, 0);
}

export function part1() {
  return doPart(2, input);
}

export function part2() {
  return doPart(3, input);
}

export const answers = [
  1582598718861,
  165278151522644
];
