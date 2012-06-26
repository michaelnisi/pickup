var path = './test/iTunes.xml'
,   fstream = require('fs').createReadStream(path)
,   pickup = require('../lib/pickup.js')()
,   test = require('tap').test
,   es = require('event-stream')

test('iTunes', function (t) {
  var expected = getExpected()
  
  es.connect(
    fstream.pipe(pickup),
    es.writeArray(function (err, lines) {
      t.deepEqual(JSON.parse(lines.join('')), expected)
      t.end()
    })
  )   
})

function getExpected () {
  return [
    { key: 'title', value: 'All About Everything' }
  , { key: 'link', value: 'http://www.example.com/podcasts/everything/index.html' }
  , { key: 'language', value: 'en-us' }
  , { key: 'subtitle', value: 'A show about everything' }
  , { key: 'author', value: 'John Doe' }
  , { key: 'summary', value: 'All About Everything is a show about everything. Each week we dive into any subject known to man and talk about it as much as we can. Look for our Podcast in the iTunes Store' }
  , { key: 'description', value: 'All About Everything is a show about everything. Each week we dive into any subject known to man and talk about it as much as we can. Look for our Podcast in the iTunes Store' }
  , { key: 'response', value: 200 }
  ]
}
