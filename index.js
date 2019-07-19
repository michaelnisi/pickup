'use strict'

// pickup - transform RSS or Atom XML to JSON

exports = module.exports = Pickup

const attribute = require('./lib/attribute')
const mappings = require('./lib/mappings')
const os = require('os')
const sax = require('saxes')
const { Entry, Feed } = require('./lib/items')
const { StringDecoder } = require('string_decoder')
const { Transform } = require('readable-stream')
const { debuglog, inherits } = require('util')

const debug = debuglog('pickup')

function State (entry, feed, image, map, name, precedence) {
  this.entry = entry
  this.feed = feed
  this.image = image
  this.map = map
  this.name = name
  this.precedence = precedence
}

State.prototype.setName = function (name) {
  this.map = mappings[name] || this.map
  this.name = name
}

State.prototype.key = function () {
  return this.map.get(this.name)
}

State.prototype.takesPrecedence = function () {
  return this.precedence.has(this.name)
}

function OpenHandlers (t) {
  this.channel = t.feedopen
  this.feed = t.feedopen
  this.item = t.entryopen
  this.entry = t.entryopen
  this.image = t.imageopen
}

function CloseHandlers (t) {
  this.channel = t.feedclose
  this.feed = t.feedclose
  this.item = t.entryclose
  this.entry = t.entryclose
  this.image = t.imageclose
}

function encodingFromString (str) {
  if (str.match(/utf-8/i)) {
    return 'utf8'
  } else if (str.match(/iso-8859-1/i)) {
    return 'binary'
  }
  return 'utf8'
}

function encodingFromOpts (opts) {
  const str = opts ? opts.charset : null
  if (typeof str !== 'string') return null
  return encodingFromString(str)
}

function Pickup (opts) {
  if (!(this instanceof Pickup)) return new Pickup(opts)
  Transform.call(this, opts)

  if (!Pickup.openHandlers) {
    Pickup.openHandlers = new OpenHandlers(Pickup.prototype)
    Pickup.closeHandlers = new CloseHandlers(Pickup.prototype)
  }

  this.encoding = encodingFromOpts(opts)
  this.decoder = new StringDecoder(this.encoding)

  this.eventMode = opts && opts.eventMode

  this.state = new State(
    null,
    null,
    false,
    new Map(),
    '',
    new Set(['content:encoded', 'pubDate'])
  )

  const parser = new sax.SaxesParser(opts ? opts.parser : null)

  parser.ontext = (text) => {
    const t = text.trim()

    if (t.length === 0) {
      debug('discarding text: whitespace')
      return
    }

    const state = this.state
    const current = state.entry || state.feed

    if (!current || !state.map) return

    let key = state.key()

    if (key === undefined) return

    if (state.image && state.name === 'url') key = 'image'

    const isSet = current[key] !== undefined

    if (isSet) {
      if (!state.takesPrecedence()) {
        return
      } else if (state.name === 'content:encoded' && t.length > 4096) {
        debug('%s: discarding text: too long', state.name)
        return
      }

      debug('%s: taking precedence: ( %s, %s )', state.name, key, t)
    }

    current[key] = t
  }

  // Not differentiating between cdata and text, whichever comes first wins.
  // This might be a mistake, but I don’t see a clear-cut alternative.

  parser.oncdata = parser.ontext

  parser.onerror = (er) => {
    debug('error: %s', er)

    this.emit('error', er)
  }

  const handle = (name, handlers) => {
    if (Object.prototype.hasOwnProperty.call(handlers, name)) {
      handlers[name].apply(this)
    }
  }

  parser.onopentag = (node) => {
    this.state.setName(node.name)
    handle(node.name, Pickup.openHandlers)

    const current = this.state.entry || this.state.feed

    if (current) {
      const key = this.state.key(node.name)

      if (key) {
        const keys = Object.keys(node.attributes)

        if (keys.length) {
          const kv = attribute(key, node.attributes, current)

          if (kv) {
            current[kv[0]] = kv[1]
          }
        }
      }
    }
  }

  parser.onclosetag = (node) => {
    handle(node.name, Pickup.closeHandlers)
    this.state.setName()
  }

  this.parser = parser
}

inherits(Pickup, Transform)

Pickup.prototype.objectMode = function () {
  return this._readableState.objectMode
}

Pickup.prototype.feedopen = function () {
  this.state.feed = new Feed()
}

Pickup.prototype.entryopen = function () {
  this.state.entry = new Entry()
}

Pickup.prototype.imageopen = function () {
  this.state.image = true
}

Pickup.prototype.entryclose = function () {
  const entry = this.state.entry

  if (!entry) return

  if (!this.eventMode) {
    if (this.objectMode()) {
      this.push(entry)
    } else {
      this.push(JSON.stringify(entry) + os.EOL)
    }
  } else {
    this.emit('entry', entry)
  }

  this.state.entry = null
}

Pickup.prototype.feedclose = function () {
  const feed = this.state.feed

  if (!feed) return

  if (!this.eventMode) {
    if (this.objectMode()) {
      this.push(feed)
    } else {
      this.push(JSON.stringify(feed) + os.EOL)
    }
  } else {
    this.emit('feed', feed)
  }

  this.state.feed = null
}

Pickup.prototype.imageclose = function () {
  this.state.image = false
}

function free (parser) {
  parser.oncdata = null
  parser.onclosetag = null
  parser.onerror = null
  parser.onopentag = null
  parser.onready = null
  parser.ontext = null
}

Pickup.prototype.invalidate = function () {
  debug('invalidating')
  this.parser.close()
  free(this.parser)

  this._decoder = null
  this.encoding = null
  this.parser = null
  this.state = null
}

Pickup.prototype._destroy = function (er, cb) {
  this.invalidate()
  Transform.prototype._destroy.call(this, er, cb)
}

Pickup.prototype._final = function (cb) {
  this.invalidate()
  cb()
}

function cribEncoding (str) {
  const enc = str.split('encoding')[1]
  const def = 'utf8'

  if (!enc) return def

  if (enc.trim()[0] === '=') {
    return encodingFromString(enc)
  }

  return def
}

Pickup.prototype._transform = function (chunk, enc, cb) {
  if (!this._decoder) {
    if (!this.encoding) {
      // This, of course, fails--yielding 'utf8'--if the first chunk is too
      // short to contain the encoding tag.
      const t = chunk.toString('ascii', 0, 128)

      this.encoding = cribEncoding(t)
    }

    this.emit('encoding', this.encoding)
  }

  const str = this.decoder.write(chunk)

  if (this.parser.closed) {
    this.parser.onready = () => {
      this.parser.write(str)
      cb()
    }

    return
  }

  this.parser.write(str)

  cb()
}

// Exports

exports.Pickup = Pickup
exports.Feed = Feed
exports.Entry = Entry

// Extending surface area when testing.

if (process.mainModule.filename.match(/test/) !== null) {
  exports.extend = function (origin, add) {
    return Object.assign(origin, add || Object.create(null))
  }

  exports.entry = function (obj) {
    return exports.extend(new Entry(), obj)
  }

  exports.feed = function (obj) {
    return exports.extend(new Feed(), obj)
  }

  exports.cribEncoding = cribEncoding

  exports.EVENTS = [
    'data',
    'drain',
    'readable',
    'end',
    'entry',
    'error',
    'feed',
    'finish'
  ]
}
