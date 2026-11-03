const { test } = require('node:test');
const assert = require('node:assert/strict');
const { defaults, calculate, validate, countDays } = require('../calculator.js');
const c = { ...defaults, salary: 17600 };
const at = (d, h, m = 0, s = 0) => new Date(2026, 10, d, h, m, s);
test('November 2026 has 21 Monday–Friday working days', () => assert.equal(countDays(c, at(3, 12)), 21));
test('before start earns nothing and counts down to work', () => {
  const r = calculate(c, at(3, 8)); assert.equal(r.earned, 0); assert.equal(r.status, 'before'); assert.equal(r.beforeSeconds, 3600);
});
test('lunch freezes earned time, while wall-clock countdown continues', () => {
  const start = calculate(c, at(3, 12)), during = calculate(c, at(3, 12, 30)), end = calculate(c, at(3, 13));
  assert.equal(start.elapsed, 10800); assert.equal(start.earned, during.earned); assert.equal(during.earned, end.earned);
  assert.equal(during.status, 'lunch'); assert.equal(end.status, 'working'); assert.equal(during.remaining, 19800);
});
test('end of shift caps earnings at one full day', () => {
  const r = calculate(c, at(3, 18)); assert.equal(r.status, 'done'); assert.equal(r.progress, 1); assert.equal(r.remaining, 0);
  assert.equal(r.earned, r.dayPay); assert.equal(calculate(c, at(3, 23)).earned, r.earned);
});
test('weekends have zero daily earnings but retain earlier monthly earnings', () => {
  const r = calculate(c, at(7, 15)); assert.equal(r.status, 'off'); assert.equal(r.earned, 0); assert.equal(r.monthEarned, r.dayPay * 5);
});
test('month-end total equals monthly salary in actual workday mode', () => {
  const r = calculate(c, at(30, 19)); assert.ok(Math.abs(r.monthEarned - c.salary) < 1e-8);
});
test('fixed-day divisor, daily and hourly salaries', () => {
  assert.equal(calculate({ ...c, divisor: 'fixed', fixedDays: 22 }, at(3, 18)).earned, 800);
  assert.equal(calculate({ ...c, basis: 'daily', salary: 300 }, at(3, 18)).earned, 300);
  assert.equal(calculate({ ...c, basis: 'hourly', salary: 50 }, at(3, 14)).earned, 200);
});
test('no lunch, customized weekends, first-day reset and leap year', () => {
  assert.equal(calculate({ ...c, lunch: false }, at(3, 18)).elapsed, 9 * 3600);
  assert.equal(calculate({ ...c, days: [0] }, at(1, 10)).elapsed, 3600);
  assert.equal(calculate(c, at(1, 10)).monthEarned, 0);
  assert.equal(countDays({ ...c, days: [0, 1, 2, 3, 4, 5, 6] }, new Date(2028, 1, 29)), 29);
});
test('reject invalid schedules and values', () => {
  assert.equal(validate(c), '');
  for (const patch of [{ salary: 0 }, { salary: NaN }, { days: [] }, { days: [7] }, { start: '19:00' }, { start: '99:00' }, { lunchEnd: '19:00' }, { lunchEnd: '11:00' }, { fixedDays: 0 }, { lunchStart: '09:00', lunchEnd: '18:00' }]) assert.notEqual(validate({ ...c, ...patch }), '');
});
