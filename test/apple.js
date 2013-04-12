var path = 'apple.xml'
  , JSONStream = require('JSONStream')
  , reader = require('fs').createReadStream(path)
  , pickup = require('../')
  , transformer = pickup()
  , test = require('tap').test
  , es = require('event-stream')
  , fs = require('fs')
  , expected = JSON.parse(fs.readFileSync('apple.json'))

test('apple', function (t) {
  var shows = []
    , episodes = []

  transformer.on('episode', function (episode) {
    episodes.push(episode)
  })

  transformer.on('show', function (show) {
    shows.push(show)
  })

  transformer.on('end', function () {
    t.equal(shows.length, 1, 'should emit show event once')
    t.equal(episodes.length, 3, 'should emit three episode events')
  })

  reader.pipe(transformer).pipe(es.writeArray(function (err, lines) {
    t.deepEqual(JSON.parse(lines.join('')), expected)
    t.end()
  }))
})
