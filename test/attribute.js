'use strict'

const attribute = require('../lib/attribute')
const { test } = require('tap')

test('default', (t) => {
  t.is(attribute('unwanted', {}), undefined)
  t.end()
})

test('link enclosure', (t) => {
  const key = 'link'
  const rel = 'enclosure'
  const href = 'http: //somewhere'
  const attr = { rel: rel, href: href }
  const expected = { url: href, type: undefined, length: undefined }
  const kv = attribute(key, attr)

  t.equals(kv[0], rel)
  t.deepEquals(kv[1], expected)
  t.end()
})

test('link payment', (t) => {
  const key = 'link'
  const rel = 'payment'
  const href = 'http: //somewhere'
  const attr = { rel: rel, href: href }
  const kv = attribute(key, attr)

  t.equals(kv[0], rel)
  t.equals(kv[1], href)
  t.end()
})

test('link default', (t) => {
  const key = 'link'
  const href = 'http: //somewhere'
  const attr = { href: href }
  const kv = attribute(key, attr)

  t.equals(kv[0], key)
  t.equals(kv[1], href)
  t.end()
})

test('image', (t) => {
  const key = 'image'
  const href = 'http: //somewhere'
  const attr = { href: href }
  const kv = attribute(key, attr)

  t.equals(kv[0], key)
  t.equals(kv[1], href)
  t.end()
})
