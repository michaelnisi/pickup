'use strict'

// pickup - transform RSS or Atom XML to JSON

exports = module.exports = Pickup

const StringDecoder = require('string_decoder').StringDecoder
const attribute = require('./lib/attribute')
const mappings = require('./lib/mappings')
const os = require('os')
const sax = require('sax')
const stream = require('readable-stream')
const util = require('util')

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

function Opts (trim, normalize, position) {
  this.trim = trim
  this.normalize = normalize
  this.position = position
}

const saxOpts = new Opts(true, true, false)

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

util.inherits(Pickup, stream.Transform)
function Pickup (opts) {
  if (!(this instanceof Pickup)) return new Pickup(opts)
  stream.Transform.call(this, opts)

  if (!Pickup.openHandlers) {
    Pickup.openHandlers = new OpenHandlers(Pickup.prototype)
    Pickup.closeHandlers = new CloseHandlers(Pickup.prototype)
  }

  this.encoding = encodingFromOpts(opts)
  this.decoder = new StringDecoder(this.encoding)

  this.eventMode = opts && opts.eventMode
  this.map = null
  this.parser = sax.parser(true, saxOpts)
  this.state = new State()

  const parser = this.parser

  parser.ontext = (t) => {
    const current = this.current()
    const map = this.map
    const state = this.state
    const name = this.state.name

    if (!current || !map) return

    let key = map.get(name)
    if (state.image && name === 'url') key = 'image'

    const isSet = current[key] !== undefined
    const isSummary = key === 'summary' && (
      name === 'summary' || name === 'itunes:summary'
    )
    if (key === undefined || (isSet && !isSummary)) return

    current[key] = t
  }

  parser.oncdata = (d) => {
    parser.ontext(d)
  }

  const handle = (name, handlers) => {
    if (handlers.hasOwnProperty(name)) {
      handlers[name].apply(this)
    }
  }
  parser.onopentag = (node) => {
    const name = node.name
    this.state.name = name
    this.map = mappings[name] || this.map
    handle(name, Pickup.openHandlers)
    const current = this.current()
    if (current) {
      const key = this.map.get(name)
      if (key) {
        const attributes = node.attributes
        const keys = Object.keys(attributes)
        if (keys.length) {
          const kv = attribute(key, attributes, current)
          if (kv) {
            current[kv[0]] = kv[1]
          }
        }
      }
    }
  }

  parser.onclosetag = (name) => {
    handle(name, Pickup.closeHandlers)
    this.state.name = null
  }
}

Pickup.prototype.current = function () {
  return this.state.entry || this.state.feed
}

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
  delete parser.oncdata
  delete parser.onclosetag
  delete parser.onopentag
  delete parser.ontext
}

Pickup.prototype._flush = function (cb) {
  free(this.parser)
  this.parser.close()

  this._decoder = null

  this.encoding = null
  this.map = null
  this.parser = null

  this.state.deinit()
  this.state = null

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
  const er = this.parser.write(str).error
  this.parser.error = null
  cb(er)
}

function Entry (
  author
, enclosure
, duration
, id
, image
, link
, subtitle
, summary
, title
, updated) {
  this.author = author
  this.enclosure = enclosure
  this.duration = duration
  this.id = id
  this.image = image
  this.link = link
  this.subtitle = subtitle
  this.summary = summary
  this.title = title
  this.updated = updated
}

function Feed (
  author
, copyright
, id
, image
, language
, link
, payment
, subtitle
, summary
, title
, ttl
, updated) {
  this.author = author
  this.copyright = copyright
  this.id = id
  this.image = image
  this.language = language
  this.link = link
  this.payment = payment
  this.subtitle = subtitle
  this.summary = summary
  this.title = title
  this.ttl = ttl
  this.updated = updated
}

function State (entry, feed, image, name) {
  this.entry = entry
  this.feed = feed
  this.image = image
  this.name = name
}

State.prototype.deinit = function () {
  this.entry = null
  this.feed = null
  this.image = false
  this.name = undefined // String()
}

function extend (origin, add) {
  return util._extend(origin, add || Object.create(null))
}
function entry (obj) {
  return extend(new Entry(), obj)
}
function feed (obj) {
  return extend(new Feed(), obj)
}

if (process.env.NODE_TEST) {
  exports.cribEncoding = cribEncoding
  exports.entry = entry
  exports.feed = feed
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
