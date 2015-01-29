
// parse - parse xml and test events

var pickup = require('../../')
var sax = require('sax')
var util = require('util')

module.exports = function (opts, cb) {
  var xml = opts.xml
  var wanted = opts.wanted
  var t = opts.t
  var stream = pickup({
    eventMode: opts.eventMode !== false ? true : false
  , objectMode: opts.objectMode !== false ? true : false
  , highWaterMark: Math.ceil(Math.random() * 32 * 1024)})
  var e = 0
  pickup.EVENTS.forEach(function (ev) {
    stream.on(ev, function (n) {
      if (process.env.DEBUG > 0) {
        console.error({ wanted: wanted[e], found: [ev, n] })
      }
      if (ev === 'end') {
        t.is(e + 1, wanted.length, 'should emit all')
        t.is(stream.decoder, null)
        t.is(stream.map, null)
        t.is(stream.parser, null)
        t.is(stream.state, null)
        return cb()
      }
      t.ok(e < wanted.length, 'should emit less')
      t.is(ev, wanted[e][0])
      if (ev === 'error') {
        t.same(n, wanted[e][1])
      } else if (ev === 'entry') {
        t.deepEqual(n, pickup.entry(wanted[e][1]))
      } else if (ev === 'feed') {
        t.deepEqual(n, pickup.feed(wanted[e][1]))
      } else {
        t.deepEqual(n, wanted[e][1])
      }
      e++
    })
  })
  // Drive
  var start = end = 0
  var ok = false
  ;(function write () {
    var slice
    do {
      end = opts.size || start + Math.ceil(
        Math.random() * xml.length)
      slice = xml.slice(start, Math.min(end, xml.length))
      ok = stream.write(slice)
      if (end >= xml.length) stream.end()
    } while (ok && (start = end) < xml.length)
    if (!ok) stream.once('drain', write)
  })()
}
