// sum.test.js
const sum = require('./sum');

test('adds 10 + 2 to equal 12', () => {
    expect(sum(10,2)).toBe(12);
});