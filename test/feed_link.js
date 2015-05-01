// feed_link - pick correct URI

// The point here is to pick the URI of the site, not that of the feed
// or any other alternatives.

var fs = require('fs')
var parse = require('./lib/parse')
var test = require('tap').test

test('the new yorker', function (t) {
  var xml = fs.readFileSync('./data/newyorker.xml')
  var wanted = [
    ['feed', {
      link: 'http://www.newyorker.com/',
      title: 'The New Yorker: Blogs'
    }],
    ['finish'],
    ['end']
  ]
  parse({ t: t, xml: xml, wanted: wanted }, function (er) {
    t.ok(!er)
    t.end()
  })
})

test('the talk show', function (t) {
  var xml = fs.readFileSync('./data/thetalkshow.xml')
  var wanted = [
    ['feed', {
      link: 'http://daringfireball.net/thetalkshow',
      title: 'The Talk Show With John Gruber'
    }],
    ['finish'],
    ['end']
  ]
  parse({ t: t, xml: xml, wanted: wanted }, function (er) {
    t.ok(!er)
    t.end()
  })
})
