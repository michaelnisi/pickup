
// parse <atom:link/>

var parse = require('./lib/parse')
var pickup = require('../')
var test = require('tap').test

function wanted () {
  return [
    ['feed', {
      link: 'http://feeds.muleradio.net/thetalkshow'
    , title: 'The Talk Show With John Gruber'
    }]
  , ['finish']
  , ['end']
  ]
}

test('feed-link', function (t) {
  parse({
    t: t
  , xml:
      '<rss><channel><atom:link rel="via" '
    + 'href="http://feeds.muleradio.net/thetalkshow"/><atom:link '
    + 'href="http://feeds.muleradio.net/thetalkshow" rel="self" '
    + 'type="application/rss+xml"/><title>The Talk Show With John '
    + 'Gruber</title><link>http://muleradio.net/thetalkshow</link>'
    + '</channel></rss>'
  , wanted: wanted() }
  , function (er) {
      t.ok(!er)
      t.end()
    }
  )
})
