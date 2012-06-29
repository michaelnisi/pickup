// pickup - stream podcast RSS to JSON

var inherits = require('inherits')
,   Stream = require('stream').Stream
,   sax = require('sax')
,   ignored = require('./ignored.js')
,   replace = require('./replace.js')
,   stringify  = require('./stringify.js')
,   parser = sax.parser(true, { trim: true })

  module.exports = function () {
  return new Pickup()
}

function Pickup () {
  Stream.call(this)

  var me = this
  ,   currentTag = null
  ,   item = null
  ,   withinItem = false
  ,   isIgnored = true
  ,   stream = stringify()
  
  me.readable = me.writable = true

  stream.on('data', function (chunk) {
    me.emit('data', chunk)
  })

  stream.on('end', function () {
    me.emit('end')
  })

  stream.on('error', function (err) {
    me.emit(err)
  })

  parser.onend = function () {
    stream.write({ key: 'response', value: 200 })
    stream.end()
  }

  parser.onerror = function (err) {
    me.emit('error', err)
    parser.resume()
  }
  
  parser.onopentag = function (node) {
    var tag = replace(node.name)
    
    isIgnored = ignored(tag)

    if (isIgnored) {
      if (!withinItem) item = null
      return
    }

    currentTag = tag
    
    if (tag === 'item') withinItem = true

    if (withinItem) {
      if (!item) item = { key: tag, value: {} }
      if (tag !== 'item' && node.attributes) {
        item.value[tag] = node.attributes
      }
    } else {
      item = { key: tag, value: node.attributes }
    }
  }

  parser.onclosetag = function (tag) {
    tag = replace(tag)
    
    if (ignored(tag)) return
    
    if (tag === 'item') withinItem = false
    if (!withinItem) stream.write(item)
  }

  parser.ontext = function (text) {
    if (isIgnored || !item) return
    
    if (withinItem) {
      item.value[currentTag] = text
    } else {
      item.value = text 
    }
  }  
}

inherits(Pickup, Stream)

Pickup.prototype.write = function (chunk) {
  return parser.write(chunk.toString())
}

Pickup.prototype.end = function () {
  parser.end()
}

Pickup.prototype.close = function () {
  parser.close()
}

Pickup.prototype.pause = function () {
}

Pickup.prototype.resume = function () {
  parser.resume()
}

Pickup.prototype.destroy = function () {
}

