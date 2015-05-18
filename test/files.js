var fs = require('fs')
var parse = require('./lib/parse')
var path = require('path')
var pickup = require('../')
var test = require('tap').test

var names = ['atom', 'rss', 'itunes', 'rss-podlove', 'atom-podlove']
var sets = names.map(function (name) {
  var xmlfile = path.join(__dirname, 'data', name + '.xml')
  var xml = fs.readFileSync(xmlfile)
  var jsonfile = path.join(__dirname, 'data', name + '.json')
  var json = JSON.parse(fs.readFileSync(jsonfile))
  return { name: name, xml: xml, data: json }
})

test('plain mode', function (t) {
  var i = 0
  function run (set) {
    if (!set) {
      t.is(i, names.length)
      return t.end()
    }
    var entries = set.data.entries
    var feed = set.data.feed
    var xml = set.xml
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
      t: t
    }, function (er) {
      t.ok(!er)
      run(sets[++i])
    })
  }
  run(sets[i])
})

test('object mode', function (t) {
  var i = 0
  function run (set) {
    if (!set) {
      t.is(i, names.length)
      return t.end()
    }
    var entries = set.data.entries
    var feed = set.data.feed
    var xml = set.xml
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
      t: t
    }, function (er) {
      t.ok(!er)
      run(sets[++i])
    })
  }
  run(sets[i])
})

test('event mode', function (t) {
  var i = 0
  function run (set) {
    if (!set) {
      t.is(i, names.length)
      return t.end()
    }
    var feed = set.data.feed
    var entries = set.data.entries
    var xml = set.xml
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
      t: t
    }, function (er) {
      t.ok(!er)
      run(sets[++i])
    })
  }
  run(sets[i])
})
