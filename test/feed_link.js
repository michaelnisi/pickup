// feed_link - pick correct URI

// The point here is to make sure we pick the URI of the site,
// not that of the feed or any other alternatives.

var fs = require('fs')
var parse = require('./lib/parse')
var test = require('tap').test
var path = require('path')

test('the new yorker', function (t) {
  var p = path.join(__dirname, 'data', 'newyorker.xml')
  var xml = fs.readFileSync(p)
  var wanted = [
    ['feed', {
      link: 'http://www.newyorker.com/',
      title: 'The New Yorker: Blogs'
    }],
    ['readable'],
    ['finish'],
    ['end']
  ]
  parse({ t: t, xml: xml, wanted: wanted }, function (er) {
    t.ok(!er)
    t.end()
  })
})

test('the talk show', function (t) {
  var p = path.join(__dirname, 'data', 'thetalkshow.xml')
  var xml = fs.readFileSync(p)
  var wanted = [
    ['feed', {
      link: 'http://daringfireball.net/thetalkshow',
      title: 'The Talk Show With John Gruber'
    }],
    ['readable'],
    ['finish'],
    ['end']
  ]
  parse({ t: t, xml: xml, wanted: wanted }, function (er) {
    t.ok(!er)
    t.end()
  })
})
