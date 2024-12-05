import { eg, input } from './input';
import { cleanAndParse } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {};

function parseData(input: string) {
  const rules = new Map<number, number[]>();
  const updates = new Array<number[]>();

  cleanAndParse(input, l => {
    if (l.includes('|')) {
      const [before, after] = l.split('|').map(Number);
      if (!rules.has(before)) {
        rules.set(before, []);
      }
      rules.get(before)!.push(after);
    }
    else if (l.includes(',')) {
      updates.push(l.split(',').map(Number));
    }
  });

  return { rules, updates };
}

function analyse(data: string) {
  const { rules, updates } = parseData(data);

  const good: number[][] = [];
  const bad: number[][] = [];

  for (const update of updates) {
    const l = update.length;
    let isGood = true;

    for (let i = 0; i < l; i++) {
      if (isGood) {
        const value = update[i];
        const forbidden = rules.get(value);
        const preceding = update.slice(0, i);

        for (const test of preceding) {
          if (forbidden?.includes(test)) {
            isGood = false;
            break;
          }
        }
      }
    }
    if (isGood) {
      good.push(update);
    }
    else {
      bad.push(update);
    }
  }

  return { good, bad, rules };
}

function getScore(updates: number[][]) {
  return updates.reduce((a, b) => a + b[Math.floor(b.length / 2)], 0);
}

function reorder(update: number[], rules: Map<number, number[]>) {
  update.sort((a, b) => {
    const rule = rules.get(a) ?? [];
    if (rule.includes(b)) {
      return -1;
    }
    return 1
  });
}

export function part1() {
  const { good } = analyse(input);

  return getScore(good);
}

export function part2() {
  const { bad, rules } = analyse(input);
  bad.forEach(b => reorder(b, rules));

  return getScore(bad);
}

export const answers = [
  5087,
  4971
];
