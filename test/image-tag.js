
// image-tag - test image tag

var test = require('tap').test
  , pickup = require('../')

test('when itunes comes last', function (t) {
  var transformer = pickup()

  transformer.on('feed', function (feed) {
    t.equals(feed.image, 'abc', 'image tag should win')
    t.end()
  })

  transformer.write('<feed>')
  transformer.write('<image><url>abc</url></image>')
  transformer.write('<itunes:image href="efg"/>')
  transformer.write('<item></item>') // TODO: no items, no feed
  transformer.write('</feed>')
  transformer.end()
})

test('when itunes comes first', function (t) {
  var transformer = pickup()

  transformer.on('feed', function (feed) {
    t.equals(feed.image, 'abc', 'image tag should win')
    t.end()
  })

  transformer.write('<feed>')
  transformer.write('<itunes:image href="efg"/>')
  transformer.write('<image><url>abc</url></image>')
  transformer.write('<item></item>') // TODO: no items, no feed
  transformer.write('</feed>')
  transformer.end()
})
