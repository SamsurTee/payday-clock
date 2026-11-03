const { test } = require('node:test');
const assert = require('node:assert/strict');
const { isAppURL } = require('../desktop/navigation.cjs');
const home = 'file:///Applications/Payday.app/Contents/Resources/app.asar/index.html';
test('desktop only allows its own document, including focus view', () => {
  assert.equal(isAppURL(home, home), true);
  assert.equal(isAppURL(home + '?view=mini', home), true);
  for (const url of ['https://example.com', 'file:///etc/passwd', 'javascript:alert(1)', 'file://otherhost/Applications/Payday.app/Contents/Resources/app.asar/index.html', 'invalid']) assert.equal(isAppURL(url, home), false);
});
