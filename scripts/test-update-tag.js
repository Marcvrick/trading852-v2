// Self-check for the "Updated" tag rule on the homepage analyses list.
// Run: node scripts/test-update-tag.js
const assert = require('assert');
const { isRecentUpdate } = require('../build.js');

const NOW = Date.parse('2026-07-31T00:00:00Z');
const t = (date, modDate) => isRecentUpdate({ date, modDate }, NOW);

// Real revisit, one day old -> tagged. This is 1913-prada.
assert.strictEqual(t('2026-04-12', '2026-07-30'), true);
// Launch-week correction (1 day after publication) -> not an update. This is 0700-tencent.
assert.strictEqual(t('2026-07-14', '2026-07-15'), false);
// Real revisit but stale (33 days) -> no longer news. This is 1167-jacobio.
assert.strictEqual(t('2026-04-14', '2026-06-28'), false);
// modDate == pubDate, the common case -> never tagged.
assert.strictEqual(t('2026-07-27', '2026-07-27'), false);
// No modDate at all -> never tagged.
assert.strictEqual(t('2026-06-29', ''), false);
// Boundary: exactly 7 days after publication and exactly 30 days old -> both inclusive.
assert.strictEqual(t('2026-06-24', '2026-07-01'), true);
// One day past the freshness window -> dropped.
assert.strictEqual(t('2026-06-23', '2026-06-30'), false);
// Malformed date -> no crash, no tag.
assert.strictEqual(t('2026-04-12', 'not-a-date'), false);
// quietUpdate: a real revisit that would otherwise tag, silenced on purpose.
// The sitemap still reads modDate; only the reader-facing tag is suppressed.
assert.strictEqual(isRecentUpdate({ date: '2026-04-12', modDate: '2026-07-30', quietUpdate: true }, NOW), false);
// ... and the flag absent or false leaves the rule untouched.
assert.strictEqual(isRecentUpdate({ date: '2026-04-12', modDate: '2026-07-30', quietUpdate: false }, NOW), true);

console.log('update-tag rule: 10 checks passed');
