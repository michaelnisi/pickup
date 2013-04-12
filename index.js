
// pickup - parse podcast RSS feed

var sax = require('sax')
  , JSONStream = require('JSONStream')
  , Transform = require('stream').Transform

var state = {
  show:false
, title:false
, item:false
, items:false
}

var events = ['show', 'episode']

var episodes = []

module.exports = function () {
  var parser = sax.parser(true)
    , show = new Show()
    , episode = null

  parser.ontext = function (t) {
    if (state.title && !show.title) {
      show.title = t
      stream.push(JSON.stringify(show))
    }

    if (state.item) {
      if (state.title && !episode.title) {
        episode.title = t
      }
    }
  }

  parser.onopentag = function (node) {
    if (node.name === 'channel') {
      stream.push('{ "show":')
      state.show = true
    }

    if (node.name === 'item') {
      if (!state.items) {
        stream.push(',"items":[')
        stream.emit(events[0], show)
      } else {
        stream.push(',')
      }
      state.show = false
      state.items = true
      state.item = true
      episode = new Episode()
    }

    state.title = node.name === 'title'
  }

  parser.onclosetag = function (name) {
    if (name === 'title') state.title = false
    if (name === 'item') {
      state.item = false
      episodes.push(episode)
      stream.push(JSON.stringify(episode))
      stream.emit(events[1], episode)
      episode = null
    }
    if (name === 'channel') {
      stream.push(']}')
      state.items = false
    }
  }

  var stream = new Transform({
    highWaterMark: 10
  });

  stream._transform = function (chunk, encoding, callback) {
    parser.write(chunk.toString())
    callback()
  }

  return stream
}

// Show - podcast show

function Show () {
  if (!(this instanceof Show)) return new Show()
  return this
}

Show.prototype = {
  title:''
}

// Episode - podcast episode

function Episode () {
  if (!(this instanceof Episode)) return new Episode()
  return this
}

Episode.prototype = {
  title:''
}
