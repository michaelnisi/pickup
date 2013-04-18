
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

  var parser = sax.parser(true)
    , name = null
    , map = null
    , current = null

  var stream = new Transform({ decodeStrings:false })

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
        current = new Entry()
        break
    }

    if (current) {
      var attributes = node.attributes
        , key = map[name]

      if (key && !current[key]) {
        if (Object.keys(attributes).length) {
          var href = key === 'link' || key === 'image'
          var value = href ? attributes.href : attributes
          current[key] = value
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
        if (state.entries) {
          stream.push(']}')
        } else {
          stream.push(JSON.stringify(current) + '}')
        }
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
