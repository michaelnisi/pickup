// radio transforms podcast RSS to JSON

var inherits = require('inherits')
,   Stream = require('stream').Stream
,   strict = true
,   options = { trim: true }
,   saxStream = require('sax').createStream(strict, options)

module.exports = function () {
  return new Radio()
}

function Radio () {
  Stream.call(this)

  var me = this
  ,   currentTag = null
  ,   prevTag = null
  ,   chunk = null
  ,   hasAttributes = false
  ,   item = null
  ,   withinItem = false
  ,   isFirstNode = true
  ,   isFirstItem = false
  ,   isFirstItemClosed = false

  me.readable = me.writable = true

  saxStream.on('close', function () {
    me.emit('close')
  })

  saxStream.on('end', function () {
    me.emit('data', '}')
  })

  saxStream.on('error', function (err) {
    me.emit('error', err)
  })

  saxStream.on('opentag', function (node) {
    if (node.name === 'rss' || node.name === 'channel') return

    prevTag = currentTag
    currentTag = getTag(node.name)
    hasAttributes = !!node.attributes

    if (currentTag === 'item') {
      withinItem = true
      isFirstItem = true && !isFirstItemClosed
    }

    if (!withinItem) {
      item = {}
    } else {
      item[currentTag] = node.attributes
    }
  })

  saxStream.on('closetag', function (tag) {
    if (tag === 'rss') me.emit('data', '}')
    if (tag === 'rss' || tag === 'channel') return

    chunk = JSON.stringify(item)
    chunk = (isFirstNode ? '{' : ',') + chunk.substr(1, chunk.length - 2)

    isFirstNode = false

    if (tag === 'item') {
      isFirstItemClosed = true
      withinItem = false
    }

    me.emit('data', chunk)
  })

  saxStream.on('text', function (text) {
    item[currentTag] = text  
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
, 'itunes:name': 'name'
, 'itunes:email': 'email'
}

function getTag(tag) {
  return tags[tag] || tag
}

inherits(Radio, Stream)

Radio.prototype.write = function (data) {
  saxStream.write(data)
}

Radio.prototype.end = function () {
  this.emit('end')
}

Radio.prototype.destroy = function () {
}

