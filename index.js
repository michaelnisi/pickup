
// pickup - transform RSS or Atom XML to JSON

var sax = require('sax')
  , Transform = require('stream').Transform
  , mappings = require('./lib/mappings')()
  , attribute = require('./lib/attribute')

module.exports = function () {
  var opt = { trim:true, normalize:true, position:false }
    , parser = sax.parser(true, opt)
    , stream = new Transform({ decodeStrings:false })
    , name = null
    , map = null
    , current = null

  var state = {
    feed:false
  , entries:false
  , entry:false
  , image:false
  }

  stream._transform = function (chunk, encoding, callback) {
    parser.write(chunk.toString())
    callback()
  }

  parser.onerror = function (err) {
    stream.emit('error', err)
    stream.push(null)
  }

  parser.ontext = function (t) {
    if (!current || !map) return

    var key = map[name]

    if (state.image && name === 'url') {
      key = 'image'
    }

    if (key) {
      var prop = current[key]
        , add = isString(prop) && isString(t) && t !== prop

      if (prop && add) {
        current[key] += t
      } else {
        current[key] = t
      }
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
    Object.keys(state).forEach(function (key) {
      state[key] = false
    })
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
