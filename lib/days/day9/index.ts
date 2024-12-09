import { eg, input } from './input';
import { cleanAndParse } from '../../utils';
import { Day } from '..';
import { parse } from 'path';

export const meta: Day['meta'] = {
  manualStart: false,
};

function parseMapPt1(data: string) {
  let space = false;
  let id = 0;

  const source = Array.from(data)
    .flatMap(n => {
      const arr = Array(parseInt(n));

      if (space) {
        arr.fill(undefined);
      }
      else {
        arr.fill(id);
        id++;
      }
      space = !space;

      return arr;
    });

  return source;
}

const vizPt1 = (m: unknown[]) => m.map(n => n ?? '.').join('')

function scorePt1(map: number[]) {
  return map.reduce((acc, n, i) => {
    if (n === undefined) {
      return acc;
    }
    return acc + n * i;
  });
}


export function part1() {
  const map = parseMapPt1(input);
  let start = 0;
  let end = map.length - 1;

  while (start <= end) {
    while (map[start] !== undefined) {
      start++;
    }
    while (map[end] === undefined) {
      end--;
    }

    if (start >= end) {
      break;
    }
    map[start] = map[end];
    map[end] = undefined;
  }

  return scorePt1(map);
}

function parseMapPt2(data: string) {
  let space = false;
  let id = 0;

  const spaces: { start: number, size: number }[] = [];
  const files: { id: number, start: number, size: number }[] = [];

  let index = 0;

  const source = Array.from(data)
    .forEach(n => {
      const size = parseInt(n, 10);
      if (space) {
        spaces.push({ start: index, size });
      }
      else {
        files.push({ id, start: index, size });
        id++;
      }
      space = !space;
      index += size;
    });

  files.reverse();

  return { files, spaces };
}

function scorePt2(files: ReturnType<typeof parseMapPt2>['files']) {
  return files.reduce((acc, { id, start, size }) => {
    return acc + id * ((start * size) + ((size * (size - 1)) / 2));
  }, 0);
}

export function part2() {
  const { files, spaces } = parseMapPt2(input);

  for (const file of files) {
    let i = 0;
    while ((i in spaces) && (spaces[i].size < file.size)) {
      i++;
    }

    if ((i in spaces) && (spaces[i].start < file.start)) {
      spaces[i].size -= file.size;
      file.start = spaces[i].start;
      spaces[i].start += file.size;
    }
  }

  return scorePt2(files);
}

export const answers = [
  6461289671426,
  6488291456470
];
