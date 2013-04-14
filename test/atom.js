
// atom - test Atom example feed

var test = require('tap').test
  , es = require('event-stream')
  , fs = require('fs')
  , reader = fs.createReadStream('atom.xml')
  , pickup = require('../')
  , transformer = pickup()
  , expected = JSON.parse(fs.readFileSync('atom.json'))

test('rss', function (t) {
  var feeds = []
    , entries = []

  transformer.on('entry', function (entry) {
    entries.push(entry)
  })

  transformer.on('feed', function (feed) {
    feeds.push(feed)
  })

  transformer.on('end', function () {
    t.equal(feeds.length, 1, 'should emit one feed')
    t.equal(entries.length, 1, 'should emit one entry')
  })

  reader.pipe(transformer).pipe(es.writeArray(function (err, lines) {
    t.deepEqual(JSON.parse(lines.join('')), expected)
    t.end()
  }))
})
