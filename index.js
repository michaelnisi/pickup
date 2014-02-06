
// pickup - transform RSS or Atom XML to JSON

var sax = require('sax')
, Transform = require('stream').Transform
, mappings = require('./lib/mappings')
, attribute = require('./lib/attribute')
, StringDecoder = require('string_decoder').StringDecoder

module.exports = function () {
  var opts = new Opts(true, true, false)
    , parser = sax.parser(true, opts)
    , stream = new Transform()
    , decoder = new StringDecoder('utf8')
    , state = new State(false, false, false, false)
    , name = null
    , map = null
    , current = null

    stream._transform = function (chunk, enc, cb) {
      try {
        parser.write(decoder.write(chunk))
      } catch (er) {
        stream.emit('error', er)
      } finally {
        cb()
      }
    }

  parser.onerror = function (er) {
    stream.emit('error', er)
      stream.push(null)
  }

parser.ontext = function (t) {
  if (!current || !map) return
  var key = state.image && name === 'url' ? 'image' : map[name]
  if (!key) return
  // TODO: *** this will probably bite us
  if (state.feed && key === 'link' && !!current.link) return
  // ***
  var prop = current[key]
    , add = isString(prop) && isString(t) && t !== prop
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
  name = node.name

    map = mappings[name] || map
    if (name in openHandlers) openHandlers[name]()

      if (current) {
        var attributes = node.attributes
          , key = map[name]
          , keys = Object.keys(attributes)

          if (key) {
            if (keys.length) {
              var kv = attribute(key, attributes)
                current[kv[0]] = kv[1]
            }
          }
      }
}

parser.onclosetag = function (name) {
  if (name in closeHandlers) closeHandlers[name]()
    name = null
}

function feedopen () {
  stream.push('{"feed":')
    current = Object.create(null)
      state.feed = true
  }

  function entryopen () {
    if (!state.entries) {
      stream.push(JSON.stringify(current) + ',"entries":[')
        stream.emit('feed', current)
    } else {
      stream.push(',')
    }
    state.feed = false
      state.entries = true
      state.entry = true
      current = new Entry()
  }

  function imageopen () {
    state.image = true
  }

  var openHandlers = {
    'channel':feedopen
      , 'feed':feedopen
      , 'item':entryopen
      , 'entry':entryopen
      , 'image':imageopen
  }

  function entryclose () {
    state.entry = false
      stream.push(JSON.stringify(current))
      stream.emit('entry', current)
      current = null
  }

  function feedclose () {
    if (state.entries) {
      stream.push(']}')
  } else {
    stream.push(JSON.stringify(current) + '}')
  }
  state.reset()
    current = null
}

function imageclose () {
  state.image = false
}

var closeHandlers = {
  'item':entryclose
    , 'entry':entryclose
    , 'channel':feedclose
    , 'feed':feedclose
    , 'image':imageclose
}

return stream
}

function isString(obj) {
  return typeof obj === 'string'
}

function Opts (trim, normalize, position) {
  this.trim = trim
    this.normalize = normalize
    this.position = position
}

function Entry (author
    , enclosure
    , duration
    , id
    , link
    , subtitle
    , summary
    , title
    , updated) {

      this.author = author
        this.enclosure = enclosure
        this.duration = duration
        this.id = id
        this.link = link
        this.subtitle = subtitle
        this.summary = summary
        this.title = title
        this.updated = updated
    }

function State (feed, entries, entry, image) {
  this.feed = feed
    this.entries = entries
    this.entry = entry
    this.image = image
}

State.prototype.reset = function () {
  this.feed = false
    this.entries = false
    this.entry = false
    this.image = false
}
