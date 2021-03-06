```javascript
var render = require('conditional-json')
```

The package exports a function of one JSON-serializable argument. It returns `{ retain: false }` or `{ retain: true, value: $rendered }`.

```javascript
var assert = require('assert')

assert.deepEqual(
  render(
    [ { a: 1,
        b: 2,
        $condition: 'x' },
      { c: 3,
        D: 4,
        $condition: 'y' } ],
    { x: true,
      y: false }),
  { retain: true,
    value: [
      { a: 1,
        b: 2 } ] })

assert.deepEqual(
  render(
    { a: {
        a: 1,
        $condition: 'x' },
      b: {
        b: 2,
        $condition: { not: 'x' } } },
    { x: true }),
  { retain: true,
    value: {
      a: {
        a: 1 } } })
```

When no part of the template is retained, `render` returns `{ retain: false }`.

```javascript
assert.deepEqual(
  render(
    { a: 1,
      $condition: 'x' },
    { x: false }),
  { retain: false })
```

Templates can be arbitrarily deep. Conditions can be arbitrarily complex [boolean-json](https://npmjs.com/packages/boolean-json-schema) expressions.

```javascript
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

The key `$condition` and retention of objects without conditions are only defaults. You can use a different key, or provide conditions from outside the template itself. Pass a third function argument that takes one argument and returns `{ value: $value }` if there is no condition for including that argument in the template, or `{ condition: $condition, value: $value }` if there is.

```javascript
assert.deepEqual(
  render(
    [ { a: 1,
        b: 2,
        $if: 'x' },
      { c: 3,
        d: 4,
        $if: 'y' },
      { e: 5,
        f: 6 } ],
    { x: true,
      y: false },
    function(argument) {
      if ('$if' in argument) {
        var condition = argument.$if
        delete argument.$if
        return {
          condition: condition,
          value: argument } }
      else {
        return {
          condition: {
            and: [
              'x',
              { not: 'x' } ] } } } }),
  { retain: true,
    value: [
      { a: 1,
        b: 2 } ] })
```
