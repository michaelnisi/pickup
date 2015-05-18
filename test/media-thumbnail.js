// parse <media:thumbnail/>

var parse = require('./lib/parse')
var pickup = require('../')
var test = require('tap').test

test('media-thumbnail', function (t) {
  var xml = [
    '<rss><channel><item><media:thumbnail url="abc"/></item>',
    '</channel></rss>'
  ].join()
  var wanted = [
    ['entry', pickup.entry({ image: 'abc' })],
    ['feed', {}],
    ['readable'],
    ['finish'],
    ['end']
  ]
  parse({ t: t, xml: xml, wanted: wanted }, function (er) {
    t.ok(!er)
    t.end()
  })
})
