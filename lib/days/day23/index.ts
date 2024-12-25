import { eg, input } from './input';
import { cleanAndParse } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {};

function parseNetwork(src: string) {
  const computers = new Map<string, Set<string>>();
  const pairs = cleanAndParse(src, l => l.split('-'));
  pairs.forEach(([a, b]) => {
    if (!computers.has(a)) {
      computers.set(a, new Set());
    }
    if (!computers.has(b)) {
      computers.set(b, new Set());
    }
    computers.get(a)!.add(b);
    computers.get(b)!.add(a);
  });
  return computers;
}
type Network = ReturnType<typeof parseNetwork>;

function findThrees(network: Network) {
  const threes = new Set<string>();

  for (const [a, bs] of network) {
    for (const b of bs) {
      const cs = network.get(b)!;
      for (const c of cs) {
        if (c === a) {
          continue;
        }
        if (network.get(c)!.has(a)) {
          const sorted = [a, b, c].sort().join(',');
          threes.add(sorted);
        }
      }
    }
  }

  return threes
}

export function part1() {
  const network = parseNetwork(input);
  const threes = findThrees(network);
  const filtered = Array.from(threes).filter(t => /(^|,)t/.test(t));
  return filtered.length;
}

function bronKerbosch(network: Network) {
  const found: string[][] = [];

  const queue: [
    Set<string>,
    Set<string>,
    Set<string>
  ][] = [[
    new Set<string>(),
    new Set<string>(network.keys()),
    new Set<string>()
  ]];

  let N = 1e5;

  while (queue.length) {
    if (N-- < 0) {
      console.log(queue.length);
      console.log(found);
      throw new Error('too many iterations');
    }

    const [r, p, x] = queue.pop()!;

    if (p.size === 0 && x.size === 0) {
      found.push(Array.from(r));
    }
    else {
      for (const v of p) {
        const nv = network.get(v)!;
        const newR = new Set(r);
        newR.add(v);
        const newP = new Set(p);
        const newX = new Set(x);
        for (const n of nv) {
          if (p.has(n)) {
            newP.delete(n);
          }
          if (x.has(n)) {
            newX.delete(n);
          }
        }
        queue.unshift([newR, newP, newX]);
        p.delete(v);
        x.add(v);
      }
    }
  }

  return found;
}


export function part2() {
  const network = parseNetwork(eg);

  const all = bronKerbosch(network);

  console.log(all);

  return 2;
}

export const answers = [
  1337,
//   54078
];
