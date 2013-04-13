
// pickup - transform RSS feed to JSON

var sax = require('sax')
  , Transform = require('stream').Transform

module.exports = function () {
  var state = {
    channel:false
  , title:false
  , subtitle:false
  , link:false
  , description:false
  , item:false
  , items:false
  }

  var parser = sax.parser(true)
    , channel = Object.create(null)
    , item = null

  parser.ontext = function (t) {
    if (state.title && !channel.title) {
      channel.title = t
    } else if (state.description && !channel.description) {
      channel.description = t
    } else if (state.link && !channel.link) {
      channel.link = t
    } else if (state.subtitle && !channel.subtitle) {
      channel.subtitle = t
    } else if (state.item) {
      if (state.title && !item.title) {
        item.title = t
      }
    }
  }

  var CHANNEL = 'channel'
    , ITEM = 'item'
    , TITLE = 'title'
    , DESCRIPTION = 'description'
    , LINK = 'link'
    , SUBTITLE = 'itunes:subtitle'

  parser.onopentag = function (node) {
    if (node.name === CHANNEL) {
      stream.push('{ "channel":')
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

    state.title = node.name === TITLE
    state.description = node.name === DESCRIPTION
    state.link = node.name === LINK
    state.subtitle = node.name === SUBTITLE
  }

  parser.onclosetag = function (name) {
    if (name === TITLE) state.title = false
    if (name === ITEM) {
      state.item = false
      stream.push(JSON.stringify(item))
      stream.emit(ITEM, item)
      item = null
    }
    if (name === CHANNEL) {
      stream.push(']}')
      Object.keys(state).forEach(function (key) {
        state[key] = false
      })
      channel = null
      item = null
    }
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
