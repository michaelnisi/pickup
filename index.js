
// pickup - transform RSS feed to JSON

var sax = require('sax')
  , Transform = require('stream').Transform

module.exports = function () {
  var state = {
    channel:false
  , items:false
  , item:false
  }

  var CHANNEL = 'channel'
    , ITEM = 'item'

  var channelMap = {
    // RSS
    'title':'title'
  , 'description':'description'
  , 'link':'link'
  , 'language':'language'
  , 'pubDate':'pubDate'
  , 'lastBuildDate':'lastBuildDate'
  , 'docs':'docs'
  , 'generator':'generator'
  , 'managingEditor':'managingEditor'
  , 'webMaster':'webMaster'
    // Atom
    // ...
    // itunes
  , 'itunes:author':'author'
  , 'itunes:summary':'summary'
  , 'itunes:subtitle':'subtitle'
  }

  var itemMap = {
    // RSS
    'title':'title'
  , 'link':'link'
  , 'description':'description'
  , 'pubDate':'pubDate'
  , 'guid':'guid'
    // Atom
    // ...
    // itunes
  , 'itunes:subtitle':'subtitle'
  , 'itunes:author':'author'
  , 'itunes:summary':'summary'
  , 'itunes:duration':'duration'
  , 'itunes:keywords':'keywords'
  , 'itunes:image':'image'
  , 'enclosure':'enclosure'
  }

  var parser = sax.parser(true)
    , channel = Object.create(null)
    , item = null
    , name = null

  parser.onerror = function (err) {
    stream.emit('error', err)
  }

  parser.ontext = function (t) {
    var pair = state.item ? [item, itemMap] : [channel, channelMap]
      , key = pair[1][name]
      , target = pair[0]

    if (key && !target[key]) {
      target[key] = t
    }
  }

  parser.onopentag = function (node) {
    name = node.name

    if (node.name === CHANNEL) {
      stream.push('{"channel":')
      state.channel = true
    }

    if (node.name === ITEM) {
      if (!state.items) {
        stream.push(JSON.stringify(channel) + ',"items":[')
        stream.emit(CHANNEL, channel)
      } else {
        stream.push(',')
      }
      state.channel = false
      state.items = true
      state.item = true
      item = Object.create(null)
    }

    if (item) {
      var attributes = node.attributes
        , keys = Object.keys(attributes)
        , key = itemMap[name]
      if (key && keys.length) {
        item[key] = attributes
      }
    }
  }

  parser.onclosetag = function (name) {
    switch (name) {
      case ITEM:
        state.item = false
        stream.push(JSON.stringify(item))
        stream.emit(ITEM, item)
        item = null
        break
      case CHANNEL:
        stream.push(']}')
        Object.keys(state).forEach(function (key) {
          state[key] = false
        })
        channel = null
        item = null
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
