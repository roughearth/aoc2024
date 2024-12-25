import { eg, eg2, input } from './input';
import { cleanAndParse, findBest, mappedSumOf, sumOf } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {};

function mix(n: bigint, secret: bigint): bigint {
  return n ^ secret;
}

function prune(n: bigint): bigint {
  return n & 16777215n;
}

function nextSecret(secret: bigint): bigint {
  const s1 = prune(mix(secret << 6n, secret)); //* 64
  const s2 = prune(mix(s1 >> 5n, s1)); // /32
  return prune(mix(s2 << 11n, s2)); // 2048
}

function nthSecret(secret: bigint, n: number): bigint {
  let s = secret;
  for (let i = 0; i < n; i++) {
    s = nextSecret(s);
  }
  return s;
}

export function part1() {
  const buyers = cleanAndParse(input, l => BigInt(l));
  return mappedSumOf(buyers, s => Number(nthSecret(s, 2000))); //
}

export function part2() {
  const buyers = cleanAndParse(input, l => BigInt(l));

  const allSequences = new Map<string, [number, number[]]>();

  buyers.forEach((b, id) => {
    let s = b;
    const sequences = new Set<string>();
    const currentPriceSequence: number[] = [Number(s) % 10];

    for (let i = 0; i < 2000; i++) {
      s = nextSecret(s);
      const price = Number(s) % 10;
      currentPriceSequence.push(price);
      if (currentPriceSequence.length === 5) {
        const diffs = [
          currentPriceSequence[1] - currentPriceSequence[0],
          currentPriceSequence[2] - currentPriceSequence[1],
          currentPriceSequence[3] - currentPriceSequence[2],
          currentPriceSequence[4] - currentPriceSequence[3]
        ];
        const diffString = diffs.join(',');
        if (!sequences.has(diffString)) {
          sequences.add(diffString);
          if (!allSequences.has(diffString)) {
            allSequences.set(diffString, [0, Array(buyers.length).fill(0)]);
          }
          const thisSeq = allSequences.get(diffString)!;
          thisSeq[0] += price;
          thisSeq[1][id] = price;
        }
        currentPriceSequence.shift();
      }
    }
  });

  const best = findBest(Array.from(allSequences.entries()), v => sumOf(v[1][1]));

  return best[1];
}

export const answers = [
  16039090236,
  1808
];
