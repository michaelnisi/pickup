
// We are not really interested in the errors,
// but we must end correctly.

var test = require('tap').test
var pickup = require('../')
var parse = require('./lib/parse')

test('parse error', function (t) {
  parse({
    t: t
  , xml: 'wtf'
  , size: Infinity
  , wanted: [
    ['error', new Error('Non-whitespace before first tag.')]
  , ['finish']
  , ['end']
  ]}
  ,
  function (er) {
    t.ok(!er)
    t.end()
  })
})

test('parse error', function (t) {
  parse({
    t: t
  , xml: '<wtf>'
  , size: Infinity
  , wanted: [
    ['finish']
  , ['end']
  ]}
  ,
  function (er) {
    t.ok(!er)
    t.end()
  })
})
