/*
function keypadSequence(cache: PathCache, keypad: Keypad, code: string) {
  const keys = Array.from(code);
  let last = 'A';
  const sequence: string[] = [];

  keys.forEach(key => {
    const position = keypad.get(last)!;
    const [row, col] = position;
    const [newRow, newCol] = keypad.get(key)!;

    const vDiff = newRow - row;
    const vSize = Math.abs(vDiff);
    const vDirection = Math.sign(vDiff);
    const [vDirectionKey] = directions.get(vDirection) ?? [];

    const hDiff = newCol - col;
    const hDirection = Math.sign(hDiff);
    const hSize = Math.abs(hDiff);
    const [, hDirectionKey] = directions.get(hDirection) ?? [];


    if (vSize) {
      sequence.push(vDirectionKey.repeat(vSize));
    }
    if (hSize) {
      sequence.push(hDirectionKey.repeat(hSize));
    }
    sequence.push('A');

    last = key;
  });

  return sequence.join("");
}

const directions = new Map([
  [1, ["v", ">"]],
  [-1, ["^", "<"]]
]);
const diffs = new Map([
  ["^", [-1, 0]], ["<", [0, -1]],
  ["v", [1, 0]], [">", [0, 1]]
]);
const directionDiffs = new Map([
  ["^", -1],
  ["v", 1],
  ["<", -1],
  [">", 1],
]);


*/
