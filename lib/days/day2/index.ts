import { eg, input } from './input';
import { cleanAndParse } from '../../utils';
import { Day } from '..';

export const meta: Day['meta'] = {};

function isSafe(report: number[]) {
  const direction = Math.sign(report[1] - report[0]);

  if (direction === 0) {
    return false;
  }

  return report.slice(1).reduce(
    (safe, value, i) => {
      const diff = (value - report[i]) * direction;
      return safe && (diff >= 1) && (diff <= 3);
    },
    true
  );
}

export function part1() {
  const reports = cleanAndParse(input, s => cleanAndParse(s, Number, { separator: ' ' }));

  const safeReports = reports.filter(report => isSafe(report));

  return safeReports.length;
}

export function part2() {
  const reports = cleanAndParse(input, s => cleanAndParse(s, Number, { separator: ' ' }));

  const safeReports = reports.filter(report => {
    const len = report.length;
    for (let i = 0; i < len; i++) {
      const testReport = [...report];
      testReport.splice(i, 1);

      if (isSafe(testReport)) {
        return true;
      }
    }
    return false;
  });

  console.log(safeReports);

  return safeReports.length;
}

export const answers = [
  572,
  612
];
