
// pickup - transform RSS or Atom XML to JSON

var sax = require('sax')
  , Transform = require('stream').Transform
  , mappings = require('./lib/mappings')()
  , CHANNEL = 'channel'
  , ITEM = 'item'
  , FEED = 'feed'
  , ENTRY = 'entry'
  , elements = [CHANNEL, ITEM, FEED, ENTRY]

function isElement(name) {
  return elements.some(function (element) {
    return name === element
  })
}

module.exports = function () {
  var state = {
    feed:false
  , entries:false
  , entry:false
  }

  var stream = new Transform()
    , parser = sax.parser(true)
    , name = null
    , map = null
    , current = null

  stream._transform = function (chunk, encoding, callback) {
    if (parser.write(chunk.toString())) {
      callback()
    }
  }

  parser.onerror = function (err) {
    stream.emit('error', err)
  }

  parser.ontext = function (t) {
    if (!current || !map) return

    var key = map[name]

    if (key && !current[key]) {
      current[key] = t
    }
  }

  parser.onopentag = function (node) {
    name = node.name

    if (isElement(name)) {
      map = mappings[name]
    }

    switch (name) {
      case CHANNEL:
      case FEED:
        stream.push('{"feed":')
        current = Object.create(null)
        state.feed = true
        break;
      case ITEM:
      case ENTRY:
        if (!state.entries) {
          stream.push(JSON.stringify(current) + ',"entries":[')
          stream.emit(FEED, current)
        } else {
          stream.push(',')
        }
        state.feed = false
        state.entries = true
        state.entry = true
        current = Object.create(null)
        break
    }

    if (current) {
      var attributes = node.attributes
        , key = map[name]

      if (key && !current[key]) {
        if (Object.keys(attributes).length) {
          current[key] = attributes
        }
      }
    }
  }

  parser.onclosetag = function (name) {
    switch (name) {
      case ITEM:
      case ENTRY:
        state.entry = false
        stream.push(JSON.stringify(current))
        stream.emit(ENTRY, current)
        current = null
        break
      case CHANNEL:
      case FEED:
        stream.push(']}')
        Object.keys(state).forEach(function (key) {
          state[key] = false
        })
        current = null
        break
    }

    name = null
  }

  return stream
}

