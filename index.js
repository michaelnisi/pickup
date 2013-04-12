
// pickup - parse podcast RSS feed

var sax = require('sax')
  , Transform = require('stream').Transform

var state = {
  show:false
, title:false
, item:false
, items:false
}

module.exports = function () {
  var parser = sax.parser(true)
    , show = {}

  parser.ontext = function (t) {
    if (state.title && !show.title) {
      show.title = t
      stream.push(JSON.stringify(show))
    }
  }

  parser.onopentag = function (node) {
    if (node.name === 'channel') {
      state.show = true
    }

    if (node.name === 'item') {
      state.show = false
    }

    state.title = state.show && node.name === 'title'
  }

  parser.onclosetag = function (node) {
    switch (node.name) {
      case 'title':
        state.title = false
        break
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
