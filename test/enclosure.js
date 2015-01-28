
// parse <enclosure />

var test = require('tap').test
var parse = require('./lib/parse')
var pickup = require('../')

test('enclosure', function (t) {
  parse({
    t: t
  , xml:
      '<rss><channel><item>'
    + '<enclosure url="abc" stowaway="huck" />'
    + '</item></channel></rss>'
  , wanted: [
      ['entry', pickup.entry({
          enclosure: { url: 'abc', type: undefined, length: undefined}})]
    , ['feed']
    , ['finish']
    , ['end']
    ]}
  , function (er) {
    t.ok(!er)
    t.end()
  })
})
