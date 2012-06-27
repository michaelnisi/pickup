var path = './test/iTunes.xml'
,   fstream = require('fs').createReadStream(path)
,   pickup = require('../lib/pickup.js')()
,   test = require('tap').test
,   es = require('event-stream')

var expected = [
  { key: 'title', value: 'All About Everything' }
, { key: 'link', value: 'http://www.example.com/podcasts/everything/index.html' }
, { key: 'language', value: 'en-us' }
, { key: 'subtitle', value: 'A show about everything' }
, { key: 'author', value: 'John Doe' }
, { key: 'summary', value: 'All About Everything is a show about everything. Each week we dive into any subject known to man and talk about it as much as we can. Look for our Podcast in the iTunes Store' }
, { key: 'description', value: 'All About Everything is a show about everything. Each week we dive into any subject known to man and talk about it as much as we can. Look for our Podcast in the iTunes Store' }
, { key: 'image', value: { href: 'http://example.com/podcasts/everything/AllAboutEverything.jpg' } }
, { key: 'item', value: { 
      title: 'Shake Shake Shake Your Spices' 
    , author: 'John Doe' 
    , subtitle: 'A short primer on table spices'
    , summary: 'This week we talk about salt and pepper shakers, comparing and contrasting pour rates, construction materials, and overall aesthetics. Come and join the party!' 
    , image: { 
      href: 'http://example.com/podcasts/everything/AllAboutEverything/Episode1.jpg'
    }
    , enclosure: {
      url: 'http://example.com/podcasts/everything/AllAboutEverythingEpisode3.m4a'
    , length: '8727310'
    , type: 'audio/x-m4a'
    }   
    , guid: 'http://example.com/podcasts/archive/aae20050615.m4a'
    , pubDate: 'Wed, 15 Jun 2005 19:00:00 GMT'
    , duration: '7:04'
    , keywords: 'salt, pepper, shaker, exciting'
  } 
}
, { key: 'response', value: 200 }
]

test('iTunes', function (t) {
  es.connect(
    fstream.pipe(pickup),
    es.writeArray(function (err, lines) {
      t.deepEqual(JSON.parse(lines.join('')), expected)
      t.end()
    })
  )   
})


