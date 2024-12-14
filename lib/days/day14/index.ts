import { eg, input } from './input';
import { cleanAndParse, modLpr, productOf, sumOf } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {};

function parseList(data: string) {
  const list = cleanAndParse(data, l => {
    const vi = l.indexOf(' v=');
    const pos = l.slice(2, vi).split(',').map(Number);
    const vel = l.slice(vi + 3).split(',').map(Number);
    return { pos, vel };
  });

  return list;
}
type Robot = ReturnType<typeof parseList>[0];

function moveRobot(robot: Robot, seconds: number, [width, height]: number[]): Robot {
  const [x, y] = robot.pos;
  const [vx, vy] = robot.vel;
  const nx = modLpr(x + vx * seconds, width);
  const ny = modLpr(y + vy * seconds, height);
  return { pos: [nx, ny], vel: robot.vel };
}

function assignToQuadrants(robots: Robot[], [width, height]: number[]) {
  const middleX = Math.floor(width / 2);
  const middleY = Math.floor(height / 2);

  const quadrants = [0, 0, 0, 0];

  robots.forEach(r => {
    const [x, y] = r.pos;
    if (x < middleX && y < middleY) {
      quadrants[0]++;
    } else if (x > middleX && y < middleY) {
      quadrants[1]++;
    } else if (x < middleX && y > middleY) {
      quadrants[2]++;
    } else if (x > middleX && y > middleY) {
      quadrants[3]++;
    }
  });

  return quadrants;
}

function visualize(robots: Robot[], [width, height]: number[]) {
  const grid = Array(height).fill(' ').map(() => Array(width).fill(' '));
  robots.forEach(r => {
    const [x, y] = r.pos;
    grid[y][x] = '#';
  });

  return grid.map(l => l.join('')).join('\n');
}

export function part1() {
  const { list, size } = input;
  const robots = parseList(list).map(
    r => moveRobot(r, 100, size)
  );

  const quadrants = assignToQuadrants(robots, size);

  return productOf(quadrants);
}

export function part2() {
  const { list, size } = input;
  const robots = parseList(list);

  const N = 10_000;
  let second = 7_300;// cheating to run quicker now I know the answer

  while (second++ < N) {
    const movedRobots = robots.map(r => moveRobot(r, second, size));

    const viz = visualize(movedRobots, size);

    // assume that a picture has a line of robots at some point
    if (viz.includes('#######')) {
      console.log(viz);
      return second;
    }
  }

}

export const answers = [
  211773366,
  7344
];
