
// parse some files

var fs = require('fs')
var parse = require('./lib/parse')
var path = require('path')
var pickup = require('../')
var test = require('tap').test

function it (name, num) {
  return { name:name, num:num }
}

test('files event mode', function (t) {
  [
    it('atom', 1)
  , it('rss', 4)
  , it('itunes', 3)
  , it('rss-podlove', 1)
  , it('atom-podlove', 1)
  ].forEach(function (it, idx) {
    var cwd = process.cwd()
    var dir = 'data'
    var i = path.join(cwd, dir, it.name + '.xml')
    var o = path.join(cwd, dir, it.name + '.json')
    var data = {}
    t.doesNotThrow(function () {
      data = JSON.parse(fs.readFileSync(o))
    })
    var wanted = []
    var n = 0
    while (n < it.num) {
      wanted.push(['entry', data.entries[n++]])
    }
    wanted.push(['feed', data.feed])
    wanted.push(['finish'])
    wanted.push(['end'])
    parse({
      xml: fs.readFileSync(i)
    , wanted: wanted
    , t: t
    }, function (er) {
      t.ok(!er)
      if (idx === 4) t.end()
    })
  })
})

test('files in object mode', function (t) {
  [
    it('atom', 1)
  , it('rss', 4)
  , it('itunes', 3)
  , it('rss-podlove', 1)
  , it('atom-podlove', 1)
  ].forEach(function (it, idx) {
    var cwd = process.cwd()
    var dir = 'data'
    var i = path.join(cwd, dir, it.name + '.xml')
    var o = path.join(cwd, dir, it.name + '.json')
    var data = {}
    t.doesNotThrow(function () {
      data = JSON.parse(fs.readFileSync(o))
    })
    var wanted = []
    var n = 0
    while (n < it.num) {
      wanted.push(['data', pickup.entry(data.entries[n++])])
      wanted.push(['readable'])
    }
    wanted.push(['data', pickup.feed(data.feed)])
    wanted.push(['readable'])
    wanted.push(['finish'])
    wanted.push(['end'])
    parse({
      xml: fs.readFileSync(i)
    , wanted: wanted
    , eventMode: false
    , t: t
    }, function (er) {
      t.ok(!er)
      if (idx === 4) t.end()
    })
  })
})
