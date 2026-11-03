'use strict';
function isAppURL(candidate, expected) {
  try {
    const a = new URL(candidate), b = new URL(expected);
    return a.protocol === 'file:' && a.host === b.host && a.pathname === b.pathname && !a.username && !a.password;
  } catch { return false; }
}
module.exports = { isAppURL };
