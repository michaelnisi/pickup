'use strict'

// feed_link - pick correct URI

// The point here is to make sure we pick the URI of the site,
// not that of the feed or any other alternatives.

const fs = require('fs')
const parse = require('./lib/parse')
const path = require('path')
const { test } = require('tap')

test('the new yorker', (t) => {
  const p = path.join(__dirname, 'data', 'newyorker.xml')
  const xml = fs.readFileSync(p)

  const wanted = [
    ['feed', {
      link: 'http://www.newyorker.com/',
      title: 'The New Yorker: Blogs'
    }],
    ['finish'],
    ['end']
  ]

  parse({ t: t, xml: xml, wanted: wanted }, (er) => {
    t.ok(!er)
    t.end()
  })
})

test('the talk show', (t) => {
  const p = path.join(__dirname, 'data', 'thetalkshow.xml')
  const xml = fs.readFileSync(p)

  const wanted = [
    ['feed', {
      link: 'http://daringfireball.net/thetalkshow',
      title: 'The Talk Show With John Gruber'
    }],
    ['finish'],
    ['end']
  ]

  parse({ t: t, xml: xml, wanted: wanted }, (er) => {
    t.ok(!er)
    t.end()
  })
})
