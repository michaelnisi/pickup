'use strict'

// check order of presidence between pubDate and lastBuildDate for the 'updated' mapping

const parse = require('./lib/parse')
const test = require('tap').test

test('pubDate overrides lastBuildDate', function (t) {
  const xml = [
    '<rss><channel>',
    '<lastBuildDate>2018-12-27T23:29:49+0000</lastBuildDate>',
    '<pubDate>2018-12-27T23:29:50+0000</pubDate>',
    '</channel></rss>'
  ].join()
  const wanted = [
    ['feed', {
      updated: '2018-12-27T23:29:50+0000'
    }],
    ['readable'],
    ['finish'],
    ['end']
  ]
  parse({ t: t, xml: xml, wanted: wanted }, (er) => {
    t.ok(!er)
    t.end()
  })
})

test('updated populated by lastBuildDate', function (t) {
  const xml = [
    '<rss><channel>',
    '<lastBuildDate>2018-12-27T23:29:49+0000</lastBuildDate>',
    '</channel></rss>'
  ].join()
  const wanted = [
    ['feed', {
      updated: '2018-12-27T23:29:49+0000'
    }],
    ['readable'],
    ['finish'],
    ['end']
  ]
  parse({ t: t, xml: xml, wanted: wanted }, (er) => {
    t.ok(!er)
    t.end()
  })
})
