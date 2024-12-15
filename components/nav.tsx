import Link from 'next/link'
import leaderBoardMap from '../lib/.leaderboardListRc.json'
import { generateArray } from '../lib/utils';
import { currentDay } from "../lib/utils/dates";
import style from './nav.module.scss';


const decemberDays = [
  [
    ...generateArray(6, i => `nov${i + 25}`),
    ...generateArray(1, i => `${i + 1}`)
  ],
  generateArray(7, i => `${i + 2}`),
  generateArray(7, i => `${i + 9}`),
  generateArray(7, i => `${i + 16}`),
  generateArray(3, i => `${i + 23}`)
];

const Nav: React.FC = () => {
  return (
    <>
      <h4>Nav</h4>
      <p><Link href={`/day/${currentDay()}`}>Today</Link></p>
      <table className={style.navCalendar}>
        <thead>
          <tr><th>Mo</th><th>Tu</th><th>We</th><th>Th</th><th>Fr</th><th>Sa</th><th>Su</th></tr>
        </thead>
        <tbody>{
          decemberDays.map((week) => <tr key={week[6] || 'end'} data-key={week[6] || 'end'}>{
            week.map((day) => <td align="right" key={`d-${day}`} data-key={`d-${day}`}>{
              (!day.startsWith('nov')) ? <Link href={`/day/${day}`}>{day}</Link> : ' '
            }</td>)
          }</tr>)
        }</tbody>
      </table>
      <ul className={style.navList}>
        {leaderBoardMap && leaderBoardMap.map(([id, name]) => (
          <li key={id}>
            <a href={`https://adventofcode.com/2024/leaderboard/private/view/${id}`} target="_blank" rel="noreferrer">{name} leaderboard</a>
          </li>
        ))}
        <li><a href="https://adventofcode.com/2024/" target="_blank" rel="noreferrer">AoC 2024</a></li>
        <li><a href="https://github.com/roughearth/aoc2024" target="_blank" rel="noreferrer">Github</a></li>
        <li><a href={`https://github.com/roughearth/aoc2024/tree/main/lib/days/day${currentDay()}`} target="_blank" rel="noreferrer">Github today</a></li>
      </ul>
    </>
  );
}

export default Nav;

