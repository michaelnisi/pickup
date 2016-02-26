var fs = require('fs')
var parse = require('./lib/parse')
var path = require('path')
var pickup = require('../')
var test = require('tap').test

var dir = path.join(__dirname, 'data')
var files = fs.readdirSync(dir)
var groups = files.reduce(function (acc, file) {
  var ext = path.extname(file)
  if (ext !== '.json') {
    return acc
  }
  var charset
  if (file === 'atom-latin1.json') {
    charset = 'ISO-8859-1'
  }
  var jsonFile = path.join(dir, file)
  var xmlFile = path.join(dir, file.split(ext)[0] + '.xml')

  var xml = fs.readFileSync(xmlFile)
  var json = JSON.parse(fs.readFileSync(jsonFile))

  var group = { name: file, xml: xml, data: json, charset: charset }

  acc.push(group)
  return acc
}, [])

test('plain mode', function (t) {
  var i = 0
  function run (group) {
    if (!group) {
      t.is(i, groups.length)
      return t.end()
    }
    var entries = group.data.entries
    var feed = group.data.feed
    var xml = group.xml
    var wanted = entries.map(function (entry) {
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
    }, function (er) {
      t.ok(!er)
      run(groups[++i])
    })
  }
  run(groups[i])
})

test('object mode', function (t) {
  var i = 0
  function run (group) {
    if (!group) {
      t.is(i, groups.length)
      return t.end()
    }
    var entries = group.data.entries
    var feed = group.data.feed
    var xml = group.xml
    var wanted = entries.map(function (entry) {
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
    }, function (er) {
      t.ok(!er)
      run(groups[++i])
    })
  }
  run(groups[i])
})

test('event mode', function (t) {
  var i = 0
  function run (group) {
    if (!group) {
      t.is(i, groups.length)
      return t.end()
    }
    var feed = group.data.feed
    var entries = group.data.entries
    var xml = group.xml
    var wanted = entries.map(function (entry) {
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
    }, function (er) {
      t.ok(!er, 'should not error')
      run(groups[++i])
    })
  }
  run(groups[i])
})

test('event mode (concurrently)', function (t) {
  var i = groups.length
  function cb (er) {
    t.ok(!er, 'should not error')
    if (--i === 0) { t.end() }
  }
  groups.forEach(function (group) {
    var feed = group.data.feed
    var entries = group.data.entries
    var xml = group.xml
    var wanted = entries.map(function (entry) {
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
