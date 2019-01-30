'use strict'

// parse <enclosure />

const fs = require('fs')
const parse = require('./lib/parse')
const path = require('path')
const pickup = require('../')
const { test } = require('tap')

test('enclosure', (t) => {
  const p = path.join(__dirname, 'data', 'enclosure.xml')
  const xml = fs.readFileSync(p)

  const wanted = [
    ['entry', pickup.entry({
      enclosure: { url: 'abc', type: undefined, length: undefined }
    })],
    ['feed'],
    ['finish'],
    ['end']
  ]

  parse({ t: t, xml: xml, wanted: wanted }, (er) => {
    t.ok(!er)
    t.end()
  })
})
