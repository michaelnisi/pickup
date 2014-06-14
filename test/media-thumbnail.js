
// parse <media:thumbnail/>

var test = require('tap').test
  , parse = require('./parse')
  , pickup = require('../')
  ;

test('media-thumbnail', function (t) {
  parse(
    t
  , '<rss><channel><item><media:thumbnail url="abc"/></item></channel></rss>'
  , [
      ["feed", {}]
    , ["entry", {
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
