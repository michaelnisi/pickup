// radio transforms podcast RSS to JSON

var inherits = require('inherits')
,   Stream = require('stream').Stream
,   strict = true
,   options = { trim: true }
,   saxStream = require('sax').createStream(strict, options)

function Transducer () {
  Stream.call(this)

  var me = this
  ,   tag = null
  ,   chunk = null
  ,   hasText = false
  ,   prevTag = null
  ,   hasAttributes = false
  ,   item = null
  ,   firstItem = true

  me.readable = me.writable = true

  saxStream.on('close', function () {
    me.emit('close')
  })

  saxStream.on('error', function (err) {
    me.emit('error', err)
  })
  
  saxStream.on('opentag', function (node) {
    hasText = false
    prevTag = tag
    tag = node.name
    hasAttributes = !!node.attributes

    if (tag === 'item') {
      item = {}
    }
    
    if (!item) return

    tag = getTag(tag)

    if (hasAttributes) {
      if (tag !== 'item') {
        item[tag] = node.attributes
      }
    }
  })

  saxStream.on('closetag', function (tag) {
    if (!item) return
    
    chunk = JSON.stringify(item)

    if (!firstItem) {
      chunk = ',' + chunk
    } else {
      chunk = '{"items":[' + chunk
    }
    
    if (tag === 'rss') {
      return
    }
    
    if (tag === 'item') {
      firstItem = false
      me.emit('data', chunk)
    }

    if (tag === 'channel') {
      me.emit('data', ']}')
    }
  })

  saxStream.on('text', function (text) {
    if (!item) return

    item[tag] = text  
  })  
}

// Tag replacements
var tags = { 
  'itunes:summary': 'summary'
, 'itunes:author': 'author' 
, 'itunes:duration': 'duration'
, 'itunes:keywords': 'keywords'
, 'itunes:subtitle': 'subtitle'
, 'itunes:image': 'image'
}

function getTag(tag) {
  return tags[tag] || tag
}

function getItem(tag, text) {
  var item = '{ "' + tag + '": "' + text + '" }, '

  return item
}

inherits(Transducer, Stream)

Transducer.prototype.write = function (data) {
  saxStream.write(data)
}

Transducer.prototype.end = function () {
  this.emit('end')
}

Transducer.prototype.destroy = function () {
}

module.exports = new Transducer()
