
// pickup - transform RSS feed to JSON

var sax = require('sax')
  , Transform = require('stream').Transform
  , maps = require('./lib/maps')()

module.exports = function () {
  var state = {
    feed:false
  , entries:false
  , entry:false
  }

  var CHANNEL = 'channel'
    , ITEM = 'item'
    , FEED = 'feed'
    , ENTRY = 'entry'

  var parser = sax.parser(true)
    , feed = Object.create(null)
    , entry = null
    , name = null
    , map = null

  parser.onerror = function (err) {
    stream.emit('error', err)
  }

  parser.ontext = function (t) {
    var pair = state.entry ? [entry, maps.item] : [feed, maps.channel]
      , key = pair[1][name]
      , target = pair[0]

    if (key && !target[key]) {
      target[key] = t
    }
  }

  var elements = ['channel', 'item', 'feed', 'entry']
  function isElement(name) {
    return elements.some(function (element) {
      name === element
    })
  }

  parser.onopentag = function (node) {
    name = node.name

    if (isElement(name)) {
      map = maps[name]
    }

    switch (name) {
      case CHANNEL:
      case FEED:
        stream.push('{"feed":')
        state.feed = true
        break;
      case ITEM:
      case ENTRY:
        if (!state.entries) {
          stream.push(JSON.stringify(feed) + ',"entries":[')
          stream.emit(FEED, feed)
        } else {
          stream.push(',')
        }
        state.feed = false
        state.entries = true
        state.entry = true
        entry = Object.create(null)
        break
    }

    if (entry) {
      var attributes = node.attributes
        , keys = Object.keys(attributes)
        , key = maps.item[name]
      if (key && keys.length) {
        entry[key] = attributes
      }
    }
  }

  parser.onclosetag = function (name) {
    switch (name) {
      case ITEM:
      case ENTRY:
        state.entry = false
        stream.push(JSON.stringify(entry))
        stream.emit(ENTRY, entry)
        entry = null
        break
      case CHANNEL:
      case FEED:
        stream.push(']}')
        Object.keys(state).forEach(function (key) {
          state[key] = false
        })
        feed = null
        entry = null
        break
    }

    name = null
  }

  var stream = new Transform({
    highWaterMark: 10
  })

  stream._transform = function (chunk, encoding, callback) {
    if (parser.write(chunk.toString())) {
      callback()
    }
  }

  return stream
}
