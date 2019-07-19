'use strict'

const pickup = require('../')
const { test } = require('tap')

test('rss', t => {
  const p = pickup()

  p.on('error', er => {
    t.comment(er.message)
  })

  p.on('end', () => {
    t.end()
  })

  p.write('<rss>')

  p.parser.closed = true

  p.write('</rss>')
  p.parser.onready()
  p.end()
  p.resume()
})
