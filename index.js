
// pickup - parse podcast RSS feed

var sax = require('sax')
  , Transform = require('stream').Transform

var state = {
  show:false
, title:false
, item:false
, items:false
}

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
        // stream.push(JSON.stringify(episode))
      }
    }
  }

  parser.onopentag = function (node) {
    if (node.name === 'channel') {
      state.show = true
    }

    if (node.name === 'item') {
      state.show = false
      state.items = true
      state.item = true
      episode = new Episode()
    }

    state.title = node.name === 'title'
  }

  parser.onclosetag = function (node) {
    if (node.name === 'title') state.title = false
    if (node.name === 'item') {
      state.item = false
      episode = null
    }
    if (node.name === 'channel') state.items = false
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
