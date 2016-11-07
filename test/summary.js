// summary overrides description

var parse = require('./lib/parse')
var pickup = require('../')
var test = require('tap').test

test('rss', function (t) {
  var xml = [
    '<rss><channel>',
    '<item><description>abc</description><itunes:summary>def</itunes:summary></item>',
    '<item><itunes:summary>def</itunes:summary><description>abc</description></item>',
    '</channel></rss>'
  ].join()
  var wanted = [
    ['entry', pickup.entry({ summary: 'def' })],
    ['entry', pickup.entry({ summary: 'def' })],
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

test('atom', function (t) {
  var xml = [
    '<feed>',
    '<entry><description>abc</description><summary>def</summary></entry>',
    '<entry><summary>def</summary><description>abc</description></entry>',
    '</feed>'
  ].join()
  var wanted = [
    ['entry', pickup.entry({ summary: 'def' })],
    ['entry', pickup.entry({ summary: 'def' })],
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
