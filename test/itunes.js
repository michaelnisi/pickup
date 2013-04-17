
// itunes - test itunes example podcast feed

var test = require('tap').test
  , transform = require('./transform')

test('itunes', function (t) {
  var feeds = []
    , entries = []
    , transformer = transform(t, 'itunes.xml', 'itunes.json')

  transformer.on('entry', function (entry) {
    entries.push(entry)
  })

  transformer.on('feed', function (feed) {
    feeds.push(feed)
  })

  transformer.on('end', function () {
    t.equal(feeds.length, 1, 'should emit one feed')
    t.equal(entries.length, 3, 'should emit three entries')
  })
})
