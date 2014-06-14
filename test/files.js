
// parse some files

var fs = require('fs')
  , parse = require('./parse')
  , path = require('path')
  , pickup = require('../')
  , test = require('tap').test
  ;

function it (name, num) {
  return { name:name, num:num }
}

test('files', function (t) {
  [
    it('atom', 1)
  , it('rss', 4)
  , it('itunes', 3)
  , it('rss-podlove', 1)
  , it('atom-podlove', 1)
  ].forEach(function (it) {
    var cwd = process.cwd()
      , dir = 'data'
      , i = path.join(cwd, dir, it.name + '.xml')
      , o = path.join(cwd, dir, it.name + '.json')
      , data = {}
      ;
    t.doesNotThrow(function () {
      data = JSON.parse(fs.readFileSync(o))
    })
    var wanted = [['feed', data.feed]]
      , n = 0
      ;
    while (n < it.num) {
      wanted.push(['entry', data.entries[n++]])
    }
    parse(t, fs.readFileSync(i), wanted)
  })
  t.end()
})
