
// parse - parse xml and test events

var util = require('util')
  , pickup = require('../')
  , events = ['entry', 'error', 'feed']
  ;

function entry (it) {
  var entry = new pickup.entry()
  for (p in it) entry[p] = it[p]
  return entry
}

module.exports = function (t, xml, wanted) {
  var parser = pickup()
    , e = 0
    ;
  events.forEach(function (ev) {
    parser.on(ev, function (n) {
      if (process.env.DEBUG) {
        console.error({ wanted: wanted[e], found: [ev, n] })
      }
      if (e >= wanted.length && (ev === 'end' || ev === 'ready')) {
        t.end()
        return
      }
      t.ok(e < wanted.length, 'should be less')
      var inspected = n instanceof Error ? '\n' + n.message : util.inspect(n)

      t.is(ev, wanted[e][0])
      if (ev === 'error') {
        t.is(n.message, wanted[e][1])
      } else if (ev === 'entry') {
        t.deepEqual(n, entry(wanted[e][1]))
      } else {
        t.deepEqual(n, wanted[e][1])
      }
      e++
    })
  })

  var start = 0
    , end = 0
    ;
  do {
    end = Math.max(start + Math.round(Math.random() * xml.length), xml.length)
    parser.write(xml.slice(start, end))
  } while ((start = end) < xml.length)
}
