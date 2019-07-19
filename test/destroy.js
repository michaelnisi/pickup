'use strict'

const pickup = require('../')
const { test } = require('tap')

test('rss', t => {
  const p = pickup()

  const errors = []

  p.on('error', er => {
    errors.push(er)
  })

  p.on('close', () => {
    t.is(errors.length, 2)
    t.end()
  })

  p.write('<rss>')
  p.destroy()
  p.write('</rss>')
})
