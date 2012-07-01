module.exports = stringify

var Stream = require('stream').Stream

function stringify (parser) {
  var op = '[\n'
  ,   sep = '\n,\n'
  ,   cl = '\n]\n'
  ,   stream = new Stream ()
  ,   anyData = false
  ,   first = true
  ,   ready = true
 
  parser.onready = function () {
    ready = true
  }

  parser.onerror = function (err) {
    parser.resume()
    stream.emit('error', err)
  }

  parser.onend = function () {
    ready = true
  }
  
  stream.readable = stream.writable = true
  
  stream.update = function (item) {
    anyData = true
    var json = JSON.stringify(item)
    if (first) { 
      first = false; 
      stream.emit('data', op + json)
    } else {
      stream.emit('data', sep + json)
    }
  }
  
  stream.write = function (chunk) {
    if (ready) {
      return parser.write(chunk.toString())
    }
  }

  stream.end = function (chunk) {
    ready = false
    parser.close()

    if (chunk) stream.write(chunk)
    if (!anyData) stream.emit('data', op)
    stream.update({ key: 'response', value: 200 })
    stream.emit('data', cl)
    stream.emit('end')
    first = true
  }

  return stream
}
