var Stream = require('stream').Stream

module.exports = function (parser) {
  var stream = new Stream
  ,   selectors = []

  stream.writable = stream.readable = true

  stream.update = function () {

  }
}
