import assert from 'node:assert/strict';
import test from 'node:test';
import { parseRating } from './log-action-options.js';

test('parseRating accepts ratings from 1 through 5', () => {
  assert.equal(parseRating('1'), 1);
  assert.equal(parseRating('2'), 2);
  assert.equal(parseRating('3'), 3);
  assert.equal(parseRating('4'), 4);
  assert.equal(parseRating('5'), 5);
});

test('parseRating accepts null for an unrated experiment', () => {
  assert.equal(parseRating('null'), null);
});

test('parseRating leaves an omitted rating unchanged', () => {
  assert.equal(parseRating(undefined), undefined);
});

test('parseRating rejects values outside the supported rating scale', () => {
  for (const value of ['0', '6', 'abc', '1.5', '', '01', '+1', '1e0', ' 1 ']) {
    assert.throws(() => parseRating(value), { message: `Invalid rating: ${value}` });
  }
});
