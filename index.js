
// pickup - transform RSS or Atom XML to JSON

module.exports = Pickup

var StringDecoder = require('string_decoder').StringDecoder
var Transform = require('stream').Transform
var attribute = require('./lib/attribute')
var mappings = require('./lib/mappings')
var sax = require('sax')
var util = require('util')

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

util.inherits(Pickup, Transform)
function Pickup (opts) {
  if (!(this instanceof Pickup)) return new Pickup(opts)
  Transform.call(this, opts)

  this.current = null
  this.decoder = new StringDecoder('utf8')
  this.map = null
  this.parser = sax.parser(true, new Opts(true, true, false))
  this.state = new State(false, false, false, false)

  var openHandlers = new OpenHandlers(Pickup.prototype)
  var closeHandlers = new CloseHandlers(Pickup.prototype)

  var me = this
  var parser = this.parser
  parser.onerror = function (er) {
    me.emit('error', er)
    me.push(null)
  }
  parser.ontext = function (t) {
    var current = me.current
    var map = me.map
    var state = me.state
    var name = me.state.name
    if (!current || !map) return
    var key = state.image && name === 'url' ? 'image' : map[name]
    if (!key) return
    // TODO: *** me will probably bite us
    if (state.feed && key === 'link' && !!current.link) return
    // ***
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
  parser.onopentag = function (node) {
    var name = node.name
    me.state.name = name
    me.map = mappings[name] || me.map
    if (name in openHandlers) {
      openHandlers[name].apply(me)
    }
    if (me.current) {
      var attributes = node.attributes
      var key = me.map[name]
      var keys = Object.keys(attributes)
      if (key) {
        if (keys.length) {
          var kv = attribute(key, attributes)
          me.current[kv[0]] = kv[1]
        }
      }
    }
  }
  parser.onclosetag = function (name) {
    if (name in closeHandlers) {
      closeHandlers[name].apply(me)
    }
    me.state.name = null
  }
}

Pickup.prototype.feedopen = function () {
  this.push('{"feed":')
  this.current = Object.create(null)
  this.state.feed = true
}

Pickup.prototype.entryopen = function () {
  if (!this.state.entries) {
    this.push(JSON.stringify(this.current) + ',"entries":[')
    this.emit('feed', this.current)
  } else {
    this.push(',')
  }
  this.state.feed = false
  this.state.entries = true
  this.state.entry = true
  this.current = new Entry()
}

Pickup.prototype.imageopen = function () {
  this.state.image = true
}

Pickup.prototype.entryclose = function () {
  this.state.entry = false
  this.push(JSON.stringify(this.current))
  this.emit('entry', this.current)
  this.current = null
}

Pickup.prototype.feedclose = function () {
  if (this.state.entries) {
    this.push(']}')
  } else {
    this.push(JSON.stringify(this.current) + '}')
  }
  this.state.reset()
  this.current = null
}

Pickup.prototype.imageclose = function () {
  this.state.image = false
}

function free (parser) {
  ['onerror', 'ontext', 'oncdata', 'onopentag', 'onclosetag']
  .forEach(function (p) {
    delete parser[p]
  })
}

Pickup.prototype._flush = function (cb) {
  free(this.parser)
  this.current = null
  this.decoder = null
  this.map = null
  this.parser = null
  this.state = null
  cb()
}

Pickup.prototype._transform = function (chunk, enc, cb) {
  try {
    this.parser.write(this.decoder.write(chunk))
  } catch (er) {
    this.emit('error', er)
  } finally {
    cb()
  }
}

function isString(obj) {
  return typeof obj === 'string'
}

function Opts (trim, normalize, position) {
  this.trim = trim
  this.normalize = normalize
  this.position = position
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

function State (feed, entries, entry, image, name) {
  this.feed = feed
  this.entries = entries
  this.entry = entry
  this.image = image
  this.name = name
}

State.prototype.reset = function () {
  this.feed = false
  this.entries = false
  this.entry = false
  this.image = false
  this.name = null
}

if (process.env.NODE_TEST) {
  module.exports.entry = Entry
}
