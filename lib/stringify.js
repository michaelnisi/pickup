module.exports = stringify

var  Stream = require('stream').Stream

function stringify () {
  var op = '[\n'
  ,   sep = '\n,\n'
  ,   cl = '\n]\n'
  
  var stream = new Stream ()
    , ended = false
    , anyData = false

  stream.first = true

  stream.write = function (data) {
    anyData = true
    var json = JSON.stringify(data)
    if(stream.first) { stream.first = false ; stream.emit('data', op + json)}
    else stream.emit('data', sep + json)
  }
  stream.end = function (data) {
    if(data) stream.write(data)
    if(!anyData) stream.emit('data', op)
    stream.emit('data', cl)
    stream.emit('end')
    stream.first = true
  }
  stream.writable = true
  stream.readable = true

  return stream
}


