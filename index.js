
// pickup - transform RSS or Atom XML to JSON

var sax = require('sax')
  , Transform = require('stream').Transform
  , mappings = require('./lib/mappings')()
  , CHANNEL = 'channel'
  , ITEM = 'item'
  , FEED = 'feed'
  , ENTRY = 'entry'
  , elements = [CHANNEL, ITEM, FEED, ENTRY]

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
      current[key] = t
    }
  }

  parser.onopentag = function (node) {
    name = node.name

    if (elements.indexOf(name) !== -1) {
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
      case 'image':
        state.image = true
        break
    }

    if (current) {
      var attributes = node.attributes
        , key = map[name]
        , keys = Object.keys(attributes)

      if (key) {
        if (keys.length) {
          switch (key) {
            case 'link':
              var rel = attributes.rel
              if (rel === 'payment') {
                key = rel
              }
              if (rel === 'enclosure') {
                key = rel
                value = attributes
                delete value.rel
              } else {
                value = attributes.href
              }
              break
            case 'image':
              value = attributes.href
              break
            default:
              value = attributes
          }

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
      case 'image':
        state.image = false
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
