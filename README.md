```javascript
var render = require('conditional-json')
var assert = require('assert')

assert.deepEqual(
  render(
    [ { $condition: 'x', a: 1, b: 2 },
      { $condition: 'y', c: 3, d: 4 } ],
    { x: true, y: false }),
  { retain: true,
    value: [ { a: 1, b: 2 } ] })

assert.deepEqual(
  render(
    [ { $if: 'x', a: 1, b: 2 },
      { $if: 'y', c: 3, d: 4 } ],
    { x: true, y: false },
    function(argument) {
      if ('$if' in argument) {
        var condition = argument.$if
        delete argument.$if
        return {
          condition: condition,
          value: argument } }
      else {
        return { value: argument } } }),
  { retain: true,
    value: [ { a: 1, b: 2 } ] })

assert.deepEqual(
  render(
    { $condition: 'x', a: 1 },
    { x: false }),
  { retain: false })

assert.deepEqual(
  render(
    { a: { $condition: 'x', a: 1 },
      b: { $condition: { not: 'x' }, b: 2 } },
    { x: true }),
  { retain: true,
    value: { a: { a: 1 } } })

assert.deepEqual(
  render(
    { addresses: [
        { address: '12 3rd Street',
          $condition: 'showHome' },
        { address: '45 6th Street',
          $condition: 'showWork' },
        { address: '78 9th Street',
          $condition: {
            and: [
              { not: 'showHome' },
              { not: 'showWork' } ] } } ],
      phones: [
        { number: '5551112222',
          $condition: 'showHome' },
        { number: '5553334444',
          $condition: 'showWork' },
        { number: '5556667777',
          $condition: {
            or: [
              { not: 'showHome' },
              { not: 'showWork' } ] } } ] },
    { showHome: false,
      showWork: true }),
    { retain: true,
      value: {
        addresses: [
          { address: '45 6th Street' } ],
        phones: [
          { number: '5553334444' },
          { number: '5556667777' } ] } })
```
