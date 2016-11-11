'use strict'

// parse <enclosure />

const fs = require('fs')
const pickup = require('../')
const parse = require('./lib/parse')
const test = require('tap').test
const path = require('path')

test('enclosure', function (t) {
  const p = path.join(__dirname, 'data', 'enclosure.xml')
  const xml = fs.readFileSync(p)
  const wanted = [
    ['entry', pickup.entry({
      enclosure: { url: 'abc', type: undefined, length: undefined }
    })],
    ['feed'],
    ['readable'],
    ['finish'],
    ['end']
  ]
  parse({ t: t, xml: xml, wanted: wanted }, function (er) {
    t.ok(!er)
    t.end()
  })
})
