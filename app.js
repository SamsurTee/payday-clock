'use strict';
const $ = id => document.getElementById(id);
const KEY = 'payday-clock-settings-v1';
let configured = false;
let settings = { ...PayClock.defaults, days: [...PayClock.defaults.days] };
let storageWarning = '';
try {
  const raw = localStorage.getItem(KEY);
  if (raw) {
    const saved = JSON.parse(raw);
    if (!PayClock.validate(saved)) { settings = saved; configured = true; }
    else storageWarning = '保存的设置不完整，请重新设置。';
  }
} catch { storageWarning = '浏览器无法读取本机设置，本次仍可正常使用。'; }
const compact = new URLSearchParams(location.search).get('view') === 'mini';
if (compact) document.body.classList.add('compact');
const form = $('settingsForm');
const dayNames = ['日', '一', '二', '三', '四', '五', '六'];
for (const day of [1, 2, 3, 4, 5, 6, 0]) {
  const label = document.createElement('label');
  const input = document.createElement('input');
  input.type = 'checkbox'; input.name = 'days'; input.value = day; input.setAttribute('aria-label', '星期' + dayNames[day]);
  const span = document.createElement('span'); span.textContent = dayNames[day];
  label.append(input, span); $('dayPicker').append(label);
}
function symbol() { return { CNY: '¥', USD: '$', HKD: 'HK$' }[settings.currency]; }
function money(n, digits = 2) { return symbol() + n.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits }); }
function hour(n) { return Number((n / 3600).toFixed(2)).toString(); }
function setText(id, text) { $(id).textContent = text; }
function render() {
  const now = new Date();
  const c = PayClock.calculate(settings, now);
  setText('dateText', now.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }));
  setText('clockText', now.toLocaleTimeString('en-GB', { hour12: false }));
  $('demoTag').hidden = configured;
  setText('currencySymbol', symbol());
  const [whole, fraction] = c.earned.toFixed(4).split('.');
  document.querySelector('.money-line').classList.toggle('large-amount', whole.length > 5);
  setText('earnedWhole', Number(whole).toLocaleString('en-US')); setText('earnedDecimal', '.' + fraction);
  setText('secondRate', money(c.rate, 4));
  setText('statusText', { working: '上班中', before: '还未开工', lunch: '午休时间', done: '已下班', off: '休息日' }[c.status]);
  $('statusBadge').dataset.status = c.status;
  setText('earningMessage', { working: '正在积累今天的小确幸', before: '先给自己一个从容的早晨', lunch: '暂停进账，好好吃饭', done: '今日收工，把时间还给生活', off: '今天的任务，是好好休息' }[c.status]);
  const progress = Math.min(100, c.progress * 100);
  setText('progressText', progress.toFixed(1) + '%'); $('progressFill').style.width = progress + '%'; $('progressBar').setAttribute('aria-valuenow', progress.toFixed(1));
  setText('workedHours', hour(c.elapsed)); setText('dailyHours', hour(c.dailySeconds));
  setText('dailyPay', money(c.workingDay ? c.dayPay : 0));
  let time = c.status === 'before' ? c.beforeSeconds : c.remaining;
  let label = '距离下班还有', note = '每一秒，都离自己的时间更近一点。';
  if (c.status === 'before') { label = '距离上班还有'; note = '不着急，新一天的收获即将开始。'; }
  if (c.status === 'lunch') note = '午休不计薪。休息一下，下午继续。';
  if (c.status === 'done') { label = '今天，辛苦啦'; note = '今天的努力已到账，接下来是你的时间。'; }
  if (c.status === 'off') { label = '今天，安心休息'; note = '生活不只有工作，也有值得期待的小事。'; }
  time = Math.ceil(time);
  setText('countdownLabel', label); setText('countdownNote', note);
  setText('timerH', String(Math.floor(time / 3600)).padStart(2, '0'));
  setText('timerM', String(Math.floor(time % 3600 / 60)).padStart(2, '0'));
  setText('timerS', String(time % 60).padStart(2, '0'));
  setText('scheduleText', settings.start + ' — ' + settings.end);
  setText('lunchText', settings.lunch ? '午休 ' + settings.lunchStart + '–' + settings.lunchEnd : '不扣午休');
  setText('monthLabel', now.getFullYear() + ' 年 ' + (now.getMonth() + 1) + ' 月');
  setText('monthEarned', money(c.monthEarned)); setText('monthTotal', money(c.monthTotal));
  setText('monthDays', c.monthDays + ' 个工作日');
  $('monthFill').style.width = Math.min(100, c.monthTotal > 0 ? c.monthEarned / c.monthTotal * 100 : 0) + '%';
  setText('hourlyRate', money(c.rate * 3600)); setText('hoursMetric', hour(c.dailySeconds)); setText('weekDays', settings.days.length);
  document.title = configured ? money(c.earned) + ' · 薪动' : '薪动 · 每一秒，都算数';
}
function updateFields() {
  const basis = form.elements.basis.value;
  $('monthlyFields').hidden = basis !== 'monthly';
  $('fixedDaysField').hidden = form.elements.divisor.value !== 'fixed';
  $('lunchFields').hidden = !form.elements.lunch.checked;
  form.elements.lunchStart.required = form.elements.lunch.checked;
  form.elements.lunchEnd.required = form.elements.lunch.checked;
  setText('salaryLabel', { monthly: '月薪金额', daily: '日薪金额', hourly: '时薪金额' }[basis]);
}
function openSettings() {
  for (const [key, value] of Object.entries(settings)) {
    if (key === 'days') { for (const el of form.querySelectorAll('[name="days"]')) el.checked = value.includes(Number(el.value)); }
    else if (key === 'lunch') form.elements.lunch.checked = value;
    else form.elements[key].value = value;
  }
  setText('formError', ''); updateFields(); $('settingsDialog').showModal();
}
let toastTimeout;
function toast(message) { setText('toast', message); $('toast').classList.add('visible'); clearTimeout(toastTimeout); toastTimeout = setTimeout(() => $('toast').classList.remove('visible'), 4500); }
form.addEventListener('change', updateFields);
form.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(form);
  const next = { salary: Number(data.get('salary')), basis: data.get('basis'), currency: data.get('currency'), divisor: data.get('divisor'), fixedDays: Number(data.get('fixedDays')), start: data.get('start'), end: data.get('end'), lunch: form.elements.lunch.checked, lunchStart: data.get('lunchStart') || '12:00', lunchEnd: data.get('lunchEnd') || '13:00', days: data.getAll('days').map(Number) };
  const error = PayClock.validate(next);
  if (error) { setText('formError', error); return; }
  settings = next; configured = true;
  let saved = true;
  try { localStorage.setItem(KEY, JSON.stringify(settings)); } catch { saved = false; }
  $('settingsDialog').close(); render();
  toast(saved ? '已保存，开始记录每一秒的收获。' : '设置已生效，但浏览器无法保存，关闭后需重新配置。');
});
$('settingsButton').addEventListener('click', openSettings);
$('closeSettings').addEventListener('click', () => $('settingsDialog').close());
$('explainButton').addEventListener('click', () => $('explainDialog').showModal());
$('closeExplain').addEventListener('click', () => $('explainDialog').close());
$('focusButton').addEventListener('click', () => {
  const url = new URL(location.href); url.searchParams.set('view', 'mini');
  const popup = window.open(url.href, 'payday-focus', 'popup,width=440,height=735');
  if (!popup) toast('小窗被浏览器拦截，请允许此页面打开弹出窗口。');
});
window.addEventListener('storage', event => {
  if (event.key !== KEY) return;
  try { const next = JSON.parse(event.newValue); if (next && !PayClock.validate(next)) { settings = next; configured = true; render(); } } catch { /* Keep valid in-memory settings. */ }
});
document.addEventListener('visibilitychange', () => { if (!document.hidden) render(); });
render(); setInterval(render, 250);
if (!configured && !compact) openSettings();
if (storageWarning) toast(storageWarning);
