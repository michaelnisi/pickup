'use strict'

// parse - parse xml and test events

module.exports = parse

const pickup = require('../../')
const { debuglog } = require('util')

const debug = debuglog('pickup')

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

  const xml = opts.xml
  const wanted = opts.wanted
  const t = opts.t
  const parser = pickup(opts)

  let e = 0

  pickup.EVENTS.forEach((ev) => {
    if (ev === 'readable') return

    parser.on(ev, (found) => {
      debug({ wanted: wanted[e], found: [ev, found] })

      const obj = wanted[e]
      t.ok(obj, 'should not emit unexpected event: ' + ev)

      const name = obj[0]
      t.is(ev, name, 'should be expected event name')

      const data = obj[1]

      if (ev === 'error') {
        t.same(found, data, 'should be expected error')
      } else if (ev === 'entry') {
        t.deepEqual(found, pickup.entry(data), 'should be expected entry')
      } else if (ev === 'feed') {
        t.deepEqual(found, pickup.feed(data), 'should be expected feed')
      } else if (ev === 'data' && typeof found === 'string') {
        const json = JSON.parse(found)
        t.deepEqual(json, data, 'should be expected data')
      } else if (ev === 'end') {
        t.is(e + 1, wanted.length, 'should emit all')
        t.is(parser.parser, null, 'should release parser')
        t.is(parser.state, null, 'should release state')
        cb()
      } else {
        t.same(found, data)
      }

      e++
    })
  })

  function write () {
    let start = 0
    let end = 0
    let ok = true
    let slice

    do {
      const size = start + Math.ceil(Math.random() * (xml.length - start))

      end = opts.size || size
      slice = xml.slice(start, Math.min(end, xml.length))
      ok = parser.write(slice)
    } while (ok && (start = end) < xml.length)

    if (!ok) {
      parser.once('drain', write)
    } else {
      parser.end()
    }
  }

  write()
}
