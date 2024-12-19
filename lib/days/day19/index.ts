import { eg, input } from './input';
import { cleanAndParse, SafetyNet } from '../../utils';
import { Day } from '..';
import { count } from 'console';

export const meta: Day['meta'] = {
  manualStart: false,
  maxMs: 5000,
  maxLoops: 1e8,
};

function parseData(data: string) {
  const lines = cleanAndParse(data);
  const towels = lines[0].split(', ');
  const designs = lines.slice(2);

  return {
    towels,
    designs
  };
}

export function part1() {
  const { designs, towels } = parseData(input);

  const cache = new Map<string, boolean>();

  function isPossible(design: string, towels: string[]): boolean {
    if (cache.has(design)) {
      return cache.get(design)!;
    }

    if (towels.includes(design)) {
      cache.set(design, true);
      return true;
    }

    const startsWith = towels.filter(towel => design.startsWith(towel));

    if (startsWith.length === 0) {
      cache.set(design, false);
      return false;
    }

    const recurred = startsWith.some(towel => {
      return (towel.length < design.length) && isPossible(design.slice(towel.length), towels)
    });

    cache.set(design, recurred);
    return recurred;
  }

  return designs.slice(0, 500).reduce(
    (acc, design) => {
      if (isPossible(design, towels)) {
        return acc + 1;
      }
      return acc;
    },
    0
  );
}

export function part2() {
  const { designs, towels } = parseData(input);

  const cache = new Map<string, number>();

  function countPossible(design: string, towels: string[]): number {
    if (cache.has(design)) {
      return cache.get(design)!;
    }

    if (design === '') {
      return 1;
    }

    const startsPossible = towels.filter(towel => design.startsWith(towel));

    const count = startsPossible.reduce((tot, towel) => {
      return tot + countPossible(design.slice(towel.length), towels);
    }, 0);

    cache.set(design, count);
    return count;
  }

  return designs.slice(0, 500).reduce(
    (acc, design) => {
      return acc + countPossible(design, towels);
    },
    0
  );
}

export const answers = [
  308,
  662726441391898
];
