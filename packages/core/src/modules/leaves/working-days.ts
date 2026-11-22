const DAY_MS = 86_400_000;

// start et end sont des dates UTC à minuit, bornes incluses
export function countWorkingDays(start: Date, end: Date, holidays: ReadonlySet<string>): number {
  let count = 0;
  for (let time = start.getTime(); time <= end.getTime(); time += DAY_MS) {
    const day = new Date(time);
    const weekday = day.getUTCDay(); // 0 = dimanche, 6 = samedi
    if (weekday === 0 || weekday === 6) continue;
    if (holidays.has(day.toISOString().slice(0, 10))) continue;
    count += 1;
  }
  return count;
}