import { eg, eg2, input } from './input';
import { cleanAndParse } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {};

function makeGate(arg1: string, op: string, arg2: string, res: string) {
  return { arg1, op, arg2, res };
}
type Gate = ReturnType<typeof makeGate>;

export function parseSrc(src: string) {
  const [initialSrc, gateSrc] = src.split('\n\n');

  const nodes = new Map<string, number>();

  const outputNodes = new Set<string>();

  const gates = cleanAndParse(gateSrc, l => {
    const [, arg1, op, arg2, res] = l.match(/([a-z0-9]*) ([A-Z]*) ([a-z0-9]*) -> ([a-z0-9]*)/)!;

    // nodes.set(arg1, undefined).set(arg2, undefined).set(res, undefined);

    if (arg1.startsWith("z") || arg2.startsWith("z")) {
      throw new Error("Invalid gate");
    }

    if (arg1.length !== 3 || arg2.length !== 3 || res.length !== 3) {
      throw new Error("Invalid gate");
    }

    if (res.startsWith("z")) {
      outputNodes.add(res);
    }

    const gate = makeGate(arg1, op, arg2, res);

    return gate;
  });

  const links = new Map<string, Gate[]>();
  gates.forEach(g => {
    const { arg1, arg2 } = g;
    if (!links.has(arg1)) {
      links.set(arg1, []);
    }
    if (!links.has(arg2)) {
      links.set(arg2, []);
    }
    links.get(arg1)!.push(g);
    links.get(arg2)!.push(g);
  });

  cleanAndParse(initialSrc, l => {
    const [key, val] = l.split(": ");
    nodes.set(key, Number(val));
  });

  return { nodes, links, gates, outputNodes };
}
type ParseSrc = ReturnType<typeof parseSrc>;
type NodeState = ParseSrc['nodes'];
type OutputNodes = ParseSrc['outputNodes'];
type Links = ParseSrc['links'];

function getResult(outputNodes: OutputNodes, nodes: NodeState, links: Links): number | undefined {
  const resultMap = new Map<string, number>();

  for (const node of outputNodes) {
    if (nodes.has(node)) {
      resultMap.set(node, nodes.get(node)!);
    }
  }

  if (resultMap.size !== outputNodes.size) {
    return;
  }

  const result = Array
    .from(resultMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .reduce(
      (acc, [, v], i) => {
        return acc + v * (2 ** i);
      },
      0
    );

  return result;
}

export function part1() {
  const { gates, nodes, links, outputNodes } = parseSrc(input);

  let result: number | undefined = undefined;

  while (!(result = getResult(outputNodes, nodes, links))) {
    for (const { arg1, arg2, op, res } of gates) {
      if (nodes.has(res)) {
        continue;
      }

      if (nodes.has(arg1) && nodes.has(arg2)) {
        let val: number;
        switch (op) {
          case "AND":
            val = nodes.get(arg1)! & nodes.get(arg2)!;
            break;
          case "OR":
            val = nodes.get(arg1)! | nodes.get(arg2)!;
            break;
          case "XOR":
            val = nodes.get(arg1)! ^ nodes.get(arg2)!;
            break;
          default:
            throw new Error("Invalid op");
        }

        nodes.set(res, val);
      }
    }
  }

  return result;
}

export function part2() {
  return 2;
}

// export const answers = [
//   54601,
//   54078
// ];
