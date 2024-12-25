import { eg, input } from './input';
import { cleanAndParse, modLpr } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {

};

function parseData(data: string) {
  const lines = cleanAndParse(data);
  const [A, B, C] = lines
    .slice(0, 3)
    .map(l => BigInt(l.slice(12)));

  const src = lines[4].slice(9);
  const program = src.split(',').map(BigInt);

  return { A, B, C, program, src };
}

function runProgram(machine: ReturnType<typeof parseData>, A: bigint) {
  let pointer = 0;
  const output: string[] = [];
  let { B, C } = machine;
  const { program } = machine;

  const combo = (n: bigint) => {
    if (n <= 3n) { return n; }
    if (n === 4n) { return A; }
    if (n === 5n) { return B; }
    if (n === 6n) { return C; }
    throw new Error(`Invalid combo: ${n}`);
  };

  const start = performance.now();

  while (pointer < program.length) {
    if ((performance.now() - start) > 1000) { output.push("X"); break; }

    const instr = program[pointer];
    const op = program[pointer + 1];
    let advance = 2;

    switch (instr) {
      case 0n: case 6n: case 7n: {
        const res = A >> combo(op);
        if (instr === 0n) {
          A = res;
          console.log(A, A & 7n);
        }
        else if (instr === 6n) { B = res; }
        else { C = res; }
        break;
      }
      case 1n: {
        B = B ^ op;
        break;
      }
      case 2n: {
        B = combo(op) & 7n;
        break;
      }
      case 3n: {
        if (A !== 0n) {
          pointer = Number(op);
          advance = 0;
        }
        break;
      }
      case 4n: {
        B = B ^ C;
        break;
      }
      case 5n: {
        const o = combo(op);
        const t = o & 7n;
        output.push(`${t}`);
        // console.log({ o, t });
        break;
      }
    }

    pointer += advance;
  }

  return { output, A, B, C };
}

export function part1() {
  const machine = parseData(input);

  const ans = runProgram(machine, machine.A).output.join(',');

  return ans;
}

function visualise(program: bigint[]) {
  const names = "adv,bxl,bst,jnz,bxc,out,bdv,cdv".split(',');
  for (let i = 0; i < program.length; i += 2) {
    const instr = program[i];
    const op = program[i + 1];
    console.log(`${names[Number(instr)]} ${op}`);
  }
}

function makeA(machine: ReturnType<typeof parseData>, i: bigint, n: bigint[]) {
  let p = machine.program.length;
  const pd: bigint[] = Array(p - n.length - 1).fill(0n);
  const v = [...n, i, ...pd];
  v.reverse();
  let a = 0n;
  // console.log({ n, a, p });
  for (let i = 0; i < p; i++) {
    a += v[i] * (8n ** BigInt(i));
  }
  return a;
}

export function part2() {
  const machine = parseData(input);

  visualise(machine.program);

  /*

  bst 4 // B = A % 8 (last three)
  bxl 7 // toggle last 3 bits of B
  cdv 5 // C = A truncated by B bits
  adv 3 // A = A truncated by 3 bits
  bxl 7 // toggle last 3 bits of B
  bxc 1 // B = B ^ C
  out 5 // output B % 8
  jnz 0 // back to start if A is not 0

  */

  for (let i = 0n; i < 8n; i++) {
    const machine = parseData(input);
    const fixed: bigint[] = [
      7n,
      2n,
      6n,
      6n
    ];

    const a = makeA(machine, i, fixed);
    const res = runProgram(machine, a);
    console.log(i, a, a % 8n, res.output.slice(-1 - fixed.length).join(','));
  }

  return parseData(input).src;
}

export const answers = [
  '1,0,2,0,5,7,2,1,3',
  // 54078
];
