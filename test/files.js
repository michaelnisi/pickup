'use strict'

const fs = require('fs')
const parse = require('./lib/parse')
const path = require('path')
const pickup = require('../')
const test = require('tap').test

const dir = path.join(__dirname, 'data')
const files = fs.readdirSync(dir)
const groups = files.reduce((acc, file) => {
  const ext = path.extname(file)
  if (ext !== '.json') {
    return acc
  }
  let charset
  if (file === 'atom-latin1.json') {
    charset = 'ISO-8859-1'
  }
  const jsonFile = path.join(dir, file)
  const xmlFile = path.join(dir, file.split(ext)[0] + '.xml')

  const xml = fs.readFileSync(xmlFile)
  const json = JSON.parse(fs.readFileSync(jsonFile))

  const group = { name: file, xml: xml, data: json, charset: charset }

  acc.push(group)
  return acc
}, [])

test('plain mode', (t) => {
  let i = 0
  function run (group) {
    if (!group) {
      t.is(i, groups.length)
      return t.end()
    }
    const entries = group.data.entries
    const feed = group.data.feed
    const xml = group.xml
    const wanted = entries.map((entry) => {
      return ['data', entry]
    })
    wanted.push(['data', feed])
    wanted.push(['readable'])
    wanted.push(['finish'])
    wanted.push(['end'])
    parse({
      xml: xml,
      wanted: wanted,
      eventMode: false,
      objectMode: false,
      encoding: 'utf8',
      charset: group.charset,
      t: t
    }, (er) => {
      t.ok(!er)
      run(groups[++i])
    })
  }
  run(groups[i])
})

test('object mode', (t) => {
  let i = 0
  function run (group) {
    if (!group) {
      t.is(i, groups.length)
      return t.end()
    }
    const entries = group.data.entries
    const feed = group.data.feed
    const xml = group.xml
    const wanted = entries.map((entry) => {
      return ['data', pickup.entry(entry)]
    })
    wanted.push(['data', pickup.feed(feed)])
    wanted.push(['readable'])
    wanted.push(['finish'])
    wanted.push(['end'])
    parse({
      xml: xml,
      wanted: wanted,
      eventMode: false,
      objectMode: true,
      charset: group.charset,
      t: t
    }, (er) => {
      t.ok(!er)
      run(groups[++i])
    })
  }
  run(groups[i])
})

test('event mode', (t) => {
  let i = 0
  function run (group) {
    if (!group) {
      t.is(i, groups.length)
      return t.end()
    }
    const feed = group.data.feed
    const entries = group.data.entries
    const xml = group.xml
    const wanted = entries.map((entry) => {
      return ['entry', entry]
    })
    wanted.push(['feed', feed])
    wanted.push(['readable'])
    wanted.push(['finish'])
    wanted.push(['end'])
    parse({
      xml: xml,
      wanted: wanted,
      charset: group.charset,
      t: t
    }, (er) => {
      t.ok(!er, 'should not error')
      run(groups[++i])
    })
  }
  run(groups[i])
})

test('event mode (concurrently)', (t) => {
  let i = groups.length
  function cb (er) {
    t.ok(!er, 'should not error')
    if (--i === 0) { t.end() }
  }
  groups.forEach((group) => {
    const feed = group.data.feed
    const entries = group.data.entries
    const xml = group.xml
    const wanted = entries.map((entry) => {
      return ['entry', entry]
    })
    wanted.push(['feed', feed])
    wanted.push(['readable'])
    wanted.push(['finish'])
    wanted.push(['end'])
    parse({
      xml: xml,
      wanted: wanted,
      charset: group.charset,
      t: t
    }, cb)
  })
})
