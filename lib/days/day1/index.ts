import { eg, input } from './input';
import { cleanAndParse } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {};

function parse(i: string) {
  return cleanAndParse(i).reduce(([l, r], line) => {
    const [a, b] = line.split(' ').filter(Boolean).map(Number);
    return [[...l, a], [...r, b]];
  }, [[] as number[], [] as number[]]);
}

export function part1() {
  const [left, right] = parse(input);
  left.sort();
  right.sort();

  return left.reduce((t, a, i) => {
    return t + Math.abs(a - right[i]);
  }, 0);
}

export function part2() {
  const [left, right] = parse(input);

  const rightCount = right.reduce((m, r) => {
    m.set(r, (m.get(r) || 0) + 1);
    return m;
  }, new Map<number, number>());

  return left.reduce((t, a) => {
    const r = rightCount.get(a) ?? 0;
    return t + (a * r);
  }, 0);
}

export const answers = [
  2164381,
  20719933
];
