
// parse <media:thumbnail/>

var parse = require('./lib/parse')
var pickup = require('../')
var test = require('tap').test

test('media-thumbnail', function (t) {
  parse({
    t: t
  , xml: '<rss><channel><item><media:thumbnail url="abc"/></item>'
       + '</channel></rss>'
  , wanted:
    [['entry', {
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
    , ['feed', {}]
    , ['finish']
    , ['end']
    ]}
  , function (er) {
    t.ok(!er)
    t.end()
  })
})
