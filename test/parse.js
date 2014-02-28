
// parse - parse xml and test events

var util = require('util')
  , pickup = require('../')
  , events = ['entry', 'error', 'feed']

module.exports = function (t, xml, wanted) {
  var parser = pickup(), e = 0
  events.forEach(function (ev) {
    parser.on(ev, function (n) {
      if (process.env.DEBUG) {
        console.error({ wanted: wanted[e], found: [ev, n] })
      }
      if (e >= wanted.length && (ev === 'end' || ev === 'ready')) {
        t.end()
        return
      }
      t.ok( e < wanted.length)
      var inspected = n instanceof Error ? '\n' + n.message : util.inspect(n)
      t.is(ev, wanted[e][0])
      if (ev === 'error') t.is(n.message, wanted[e][1])
      else t.deepEqual(n, wanted[e][1])
      e++
      // if (ev === 'error') parser.resume()
    })
  })
  if (xml) parser.write(xml)
  t.end()
}
