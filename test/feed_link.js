
var test = require('tap').test
  , pickup = require('../')
  , stread = require('stread')
  , Writable = require('stream').Writable
  ;

test('rss', function (t) {
  t.plan(1)

  var found = ''
    , writer = new Writable()
    ;
  stread(xml())
    .pipe(pickup())
    .pipe(writer)
    .on('finish', function () {
      t.is(found, wanted())
      t.end()
    })
  writer._write = function (chunk, enc, cb) {
    found += chunk
    cb()
  }
})

function xml () {
  return '<rss><channel><atom:link rel="via" \
    href="http://feeds.muleradio.net/thetalkshow"/><atom:link \
    href="http://feeds.muleradio.net/thetalkshow" rel="self" \
    type="application/rss+xml"/><title>The Talk Show With John \
    Gruber</title><link>http://muleradio.net/thetalkshow</link> \
    </channel></rss>'
}

function wanted () {
  return '{"feed":{"link":"http://feeds.muleradio.net/thetalkshow",' +
    '"title":"The Talk Show With John Gruber"}}'
}
