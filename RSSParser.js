
var sax = require('sax')
  , Transform = require('stream').Transform
  , util = require('util')

function RSSTransform(opt) {
  if (!(this instanceof RSSTransform)) return new RSSTransform(opt)

  var parser = this

  Transform.call(parser)
}

util.inherits(RSSTransform, Transform)

RSSTransform.prototype = {
  clearBuffers: function () {

  }
}
