
// pickup - transform RSS or Atom XML to JSON

exports = module.exports = Pickup

var StringDecoder = require('string_decoder').StringDecoder
var assert = require('assert')
var attribute = require('./lib/attribute')
var mappings = require('./lib/mappings')
var os = require('os')
var sax = require('sax')
var stream = require('readable-stream')
var util = require('util')

function isString(obj) {
  return typeof obj === 'string'
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

function Opts (trim, normalize, position) {
  this.trim = trim
  this.normalize = normalize
  this.position = position
}

util.inherits(Pickup, stream.Transform)
function Pickup (opts) {
  if (!(this instanceof Pickup)) return new Pickup(opts)
  stream.Transform.call(this, opts)
  if (!Pickup.openHandlers) {
    Pickup.openHandlers = new OpenHandlers(Pickup.prototype)
    Pickup.closeHandlers = new CloseHandlers(Pickup.prototype)
  }

  this.decoder = new StringDecoder('utf8')
  this.eventMode = opts && opts.eventMode
  this.map = null
  this.parser = sax.parser(true, new Opts(true, true, false))
  this.state = new State()

  var me = this
  var parser = this.parser
  parser.ontext = function (t) {
    var current = me.current()
    var map = me.map
    var state = me.state
    var name = me.state.name
    if (!current || !map) return
    var key = state.image && name === 'url' ? 'image' : map[name]
    if (!key) return
    if (state.feed && key === 'link' && !!current.link) return
    var prop = current[key]
    var add = isString(prop) && isString(t) && t !== prop
    if (prop && add) {
      current[key] += t
    } else {
      current[key] = t
    }
  }
  parser.oncdata = function (d) {
    parser.ontext(d)
  }
  function handle (name, handlers) {
    if (handlers.hasOwnProperty(name)) {
      handlers[name].apply(me)
    }
  }
  parser.onopentag = function (node) {
    var name = node.name
    me.state.name = name
    me.map = mappings[name] || me.map
    handle(name, Pickup.openHandlers)
    var current = me.current()
    if (current) {
      var key = me.map[name]
      if (key) {
        var attributes = node.attributes
        var keys = Object.keys(attributes)
        if (keys.length) {
          var kv = attribute(key, attributes)
          if (kv) current[kv[0]] = kv[1]
        }
      }
    }
  }
  parser.onclosetag = function (name) {
    handle(name, Pickup.closeHandlers)
    me.state.name = null
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
  var entry = this.state.entry
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
  var feed = this.state.feed
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
  ['ontext', 'oncdata', 'onopentag', 'onclosetag']
  .forEach(function (p) {
    delete parser[p]
  })
}

Pickup.prototype.deinit = function () {
  free(this.parser)
  this.parser.close()
  this.parser = null
  this.decoder = null
  this.map = null
  this.state.deinit()
  this.state = null
}

Pickup.prototype._flush = function (cb) {
  this.deinit()
  cb()
}

Pickup.prototype._transform = function (chunk, enc, cb) {
  var str = this.decoder.write(chunk)
  var er = this.parser.write(str).error
  cb(er)
  this.parser.error = null
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
  return util._extend(origin, add || Object.create(null)) }
function entry (obj) {
  return extend(new Entry(), obj) }
function feed (obj) {
  return extend(new Feed(), obj) }

if (process.env.NODE_TEST) {
  exports.entry = entry
  exports.feed = feed
  exports.EVENTS = [
    'data'
  , 'drain'
  , 'readable'
  , 'end'
  , 'entry'
  , 'error'
  , 'feed'
  , 'finish'
  ]
}
