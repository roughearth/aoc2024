import { eg, eg2, input } from './input';
import { cleanAndParse } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {};

function evalMul(s: string) {
  const [a, b] = s
    .replace('mul(', '')
    .replace(')', '')
    .split(',')
    .map(Number);

  return a * b;
}

export function part1() {
  const regex = /mul\(\d{1,3},\d{1,3}\)/g;

  const ex = input.match(regex);

  const ans = ex?.reduce((acc, curr) => acc + evalMul(curr), 0);

  return ans;
}

export function part2() {
  const regex = /(mul\(\d{1,3},\d{1,3}\))|(do\(\))|(don't\(\))/g;
  const ex = input.match(regex);

  let doMul = true;

  const ans = ex?.reduce((acc, curr) => {
    if (curr === "do()") {
      doMul = true;
      return acc;
    }
    if (curr === "don't()") {
      doMul = false;
      return acc;
    }
    if (doMul) {
      return acc + evalMul(curr);
    }
    return acc;
  }, 0);


  return ans;
}

export const answers = [
  188116424,
  104245808
];
