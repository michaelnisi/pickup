// parse - parse xml and test events

module.exports = parse

var pickup = require('../../')
var util = require('util')

function nop () {}

var debug = (function () {
  return parseInt(process.env.NODE_DEBUG, 10) === 1
  ? function (o) {
    console.error('** parse: %s', util.inspect(o))
  } : nop
}())

function defaults (opts) {
  if (opts.eventMode === undefined) {
    opts.eventMode = true
  }
  if (opts.charset === undefined) {
    opts.charset = Math.round(Math.random()) > 0.5 ? 'utf8' : null
  }
  return opts
}

function parse (opts, cb) {
  opts = defaults(opts)
  var xml = opts.xml
  var wanted = opts.wanted
  var t = opts.t
  var stream = pickup(opts)
  var e = 0
  pickup.EVENTS.forEach(function (ev) {
    stream.on(ev, function (found) {
      debug({ wanted: wanted[e], found: [ev, found] })
      var obj = wanted[e]
      t.ok(obj, 'should not emit unexpected event: ' + ev)
      var name = obj[0]
      t.is(ev, name, 'should be expected event name')
      var data = obj[1]
      if (ev === 'error') {
        t.same(found, data, 'should be expected error')
      } else if (ev === 'entry') {
        t.deepEqual(found, pickup.entry(data), 'should be expected entry')
      } else if (ev === 'feed') {
        t.deepEqual(found, pickup.feed(data), 'should be expected feed')
      } else if (ev === 'data' && typeof found === 'string') {
        var json = JSON.parse(found)
        t.deepEqual(json, data, 'should be expected data')
      } else if (ev === 'end') {
        t.is(e + 1, wanted.length, 'should emit all')
        t.is(stream.map, null, 'should release map')
        t.is(stream.parser, null, 'should release parser')
        t.is(stream.state, null, 'should release state')
        cb()
      } else {
        t.same(found, data)
      }
      e++
    })
  })
  function write () {
    var start = 0
    var end = 0
    var ok = true
    var slice
    do {
      var size = start + Math.ceil(Math.random() * (xml.length - start))
      end = opts.size || size
      slice = xml.slice(start, Math.min(end, xml.length))
      ok = stream.write(slice)
    } while (ok && (start = end) < xml.length)
    if (!ok) {
      stream.once('drain', write)
    } else {
      stream.end()
    }
  }
  write()
}
