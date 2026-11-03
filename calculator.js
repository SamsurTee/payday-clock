(function (root) {
  'use strict';
  const defaults = { salary: 12000, basis: 'monthly', divisor: 'actual', fixedDays: 21.75, start: '09:00', end: '18:00', lunch: true, lunchStart: '12:00', lunchEnd: '13:00', days: [1, 2, 3, 4, 5], currency: 'CNY' };
  const minutes = t => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
  function validate(c) {
    if (!Number.isFinite(c.salary) || c.salary <= 0 || c.salary > 100000000) return '请输入大于 0、不超过一亿的薪资。';
    if (!['monthly', 'daily', 'hourly'].includes(c.basis) || !['actual', 'fixed'].includes(c.divisor)) return '请选择有效的薪资类型和折算方式。';
    if (!['CNY', 'USD', 'HKD'].includes(c.currency)) return '请选择有效的币种。';
    for (const key of ['start', 'end', 'lunchStart', 'lunchEnd']) if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(c[key])) return '请填写完整的工作和午休时间。';
    if (minutes(c.end) <= minutes(c.start)) return '下班时间应晚于上班时间（当前支持同日班次）。';
    if (c.lunch && (minutes(c.lunchStart) < minutes(c.start) || minutes(c.lunchEnd) > minutes(c.end) || minutes(c.lunchEnd) <= minutes(c.lunchStart))) return '午休须在上下班时间内，且结束时间晚于开始时间。';
    if (duration(c) <= 0) return '每天至少需要一段有效的工作时间。';
    if (!Array.isArray(c.days) || !c.days.length || c.days.some(d => !Number.isInteger(d) || d < 0 || d > 6) || new Set(c.days).size !== c.days.length) return '请至少选择一个工作日。';
    if (!Number.isFinite(c.fixedDays) || c.fixedDays <= 0 || c.fixedDays > 31) return '固定计薪天数须大于 0 且不超过 31。';
    return '';
  }
  function duration(c) { return (minutes(c.end) - minutes(c.start) - (c.lunch ? minutes(c.lunchEnd) - minutes(c.lunchStart) : 0)) * 60; }
  function segments(c) { return c.lunch ? [[minutes(c.start) * 60, minutes(c.lunchStart) * 60], [minutes(c.lunchEnd) * 60, minutes(c.end) * 60]] : [[minutes(c.start) * 60, minutes(c.end) * 60]]; }
  function countDays(c, date, before = 32) {
    const total = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    let count = 0;
    for (let d = 1; d <= total && d < before; d++) if (c.days.includes(new Date(date.getFullYear(), date.getMonth(), d).getDay())) count++;
    return count;
  }
  function calculate(c, now = new Date()) {
    const dailySeconds = duration(c), monthDays = countDays(c, now);
    const dayPay = c.basis === 'monthly' ? c.salary / (c.divisor === 'actual' ? monthDays : c.fixedDays) : c.basis === 'daily' ? c.salary : c.salary * dailySeconds / 3600;
    const rate = dayPay / dailySeconds;
    const clockSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds() + now.getMilliseconds() / 1000;
    const workingDay = c.days.includes(now.getDay());
    const elapsed = workingDay ? segments(c).reduce((n, [s, e]) => n + Math.max(0, Math.min(clockSeconds, e) - s), 0) : 0;
    let status = 'working';
    if (!workingDay) status = 'off';
    else if (clockSeconds < minutes(c.start) * 60) status = 'before';
    else if (clockSeconds >= minutes(c.end) * 60) status = 'done';
    else if (c.lunch && clockSeconds >= minutes(c.lunchStart) * 60 && clockSeconds < minutes(c.lunchEnd) * 60) status = 'lunch';
    const remaining = workingDay ? Math.max(0, minutes(c.end) * 60 - clockSeconds) : 0;
    return { dailySeconds, monthDays, dayPay, rate, elapsed, workingDay, status, remaining, earned: elapsed * rate, progress: elapsed / dailySeconds, monthEarned: countDays(c, now, now.getDate()) * dayPay + elapsed * rate, monthTotal: monthDays * dayPay, beforeSeconds: Math.max(0, minutes(c.start) * 60 - clockSeconds), lunchSeconds: c.lunch ? Math.max(0, minutes(c.lunchEnd) * 60 - clockSeconds) : 0 };
  }
  const api = { defaults, validate, duration, calculate, countDays };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.PayClock = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
