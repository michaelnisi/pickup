// parse feed image

var parse = require('./lib/parse')
var test = require('tap').test

test('image', function (t) {
  var xml = [
    '<rss><channel>',
    '<itunes:image href="abc" />',
    '<media:thumbnail url="def" />',
    '<image><url>ghi</url></image>',
    '</channel></rss>'
  ].join()
  var wanted = [
    ['feed', {
      image: 'abc'
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
