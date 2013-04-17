
// atom - test Atom example feed

var test = require('tap').test
  , transform = require('./transform')

test('rss', function (t) {
  var feeds = []
    , entries = []
    , transformer = transform(t, 'atom.xml', 'atom.json')

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
})
