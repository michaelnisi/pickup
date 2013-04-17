
// rss - test RSS example feed

var test = require('tap').test
  , transform = require('./transform')
  , pickup = require('../')

test('rss', function (t) {
  var feeds = []
    , entries = []
    , transformer = transform(t, './rss.xml', 'rss.json')

  transformer.on('entry', function (entry) {
    entries.push(entry)
  })

  transformer.on('feed', function (feed) {
    feeds.push(feed)
  })

  transformer.on('end', function () {
    t.equal(feeds.length, 1, 'should emit one feed')
    t.equal(entries.length, 4, 'should emit four entries')
  })
})

test('no entries', function (t) {
  var transformer = pickup()

  transformer.write('<feed>')
  transformer.write('<title>Feed title</title>')
  transformer.write('</feed>')

  var expected = {feed:{title:'Feed title'}}
    , actual = JSON.parse(transformer.read())

  t.deepEqual(actual, expected)
  t.end()
})
