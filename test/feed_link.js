
// parse <atom:link/>

var test = require('tap').test
  , parse = require('./parse')
  , pickup = require('../')
  ;

// TODO: Validate! Probably not correct.
// Link generally means the site not the feed.

test('feed-link', function (t) {
  parse(
    t
  , '<rss><channel><atom:link rel="via" \
    href="http://feeds.muleradio.net/thetalkshow"/><atom:link \
    href="http://feeds.muleradio.net/thetalkshow" rel="self" \
    type="application/rss+xml"/><title>The Talk Show With John \
    Gruber</title><link>http://muleradio.net/thetalkshow</link> \
    </channel></rss>'
  , [
      ['feed', {
        link:'http://feeds.muleradio.net/thetalkshow'
      , title:'The Talk Show With John Gruber'
      }]
    , ['entry', {
        author:undefined
      , enclosure:undefined
      , duration:undefined
      , id:undefined
      , image:'abc'
      , link:undefined
      , subtitle:undefined
      , summary:undefined
      , title:undefined
      , updated:undefined
      }]
    ]
  )
  t.end()
})
