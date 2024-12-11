import { eg, input } from './input';
import { mappedSumOf } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {
  manualStart: false,
};

function parseStones(data: string) {
  return data.split(' ').map(Number);
}

function transform(stone: number) {
  if (stone === 0) {
    return [1];
  }

  const txt = stone.toString();
  const ln = txt.length;
  if (ln % 2 === 0) {
    return [txt.slice(0, ln / 2), txt.slice(ln / 2)].map(Number);
  }

  return [stone * 2024];
}

export function part1() {
  let stones = parseStones(input);

  for (let i = 0; i < 25; i++) {
    stones = stones.flatMap(transform);
  }

  return stones.length;
}

function StoneMap() {
  const map = new Map<number, number>();

  function add(stone: number, value: number) {
    map.set(stone, get(stone) + value);
  }

  function get(stone: number) {
    return map.get(stone) ?? 0;
  }

  function stones() {
    return Array.from(map.entries());
  }

  return { add, get, stones };
}

export function part2() {
  let allStones = parseStones(input);
  let stoneMap = StoneMap();
  allStones.forEach(stone => stoneMap.add(stone, 1));

  for (let i = 0; i < 75; i++) {
    stoneMap = stoneMap.stones().reduce(
      (nextStoneMap, [stone, count]) => {
        const nextStones = transform(stone);

        nextStones.forEach(nextStone => {
          nextStoneMap.add(nextStone, count);
        });

        return nextStoneMap;
      },
      StoneMap()
    );
  }

  return mappedSumOf(stoneMap.stones(), ([, count]) => count);
}

export const answers = [
  222461,
  264350935776416
];
