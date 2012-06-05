// radio transforms podcast RSS to JSON

var inherits = require('inherits')
,   Stream = require('stream').Stream
,   strict = true
,   options = { trim: true }
,   saxStream = require('sax').createStream(strict, options)

function Radio () {
  Stream.call(this)

  var me = this
  ,   currentTag = null
  ,   prevTag = null
  ,   chunk = null
  ,   hasAttributes = false
  ,   item = null
  ,   firstItem = undefined
  ,   itemOpened = false
  ,   itemClosed = true
  ,   withinItem = false

  me.readable = me.writable = true

  saxStream.on('close', function () {
    me.emit('close')
  })

  saxStream.on('error', function (err) {
    me.emit('error', err)
  })

  saxStream.on('opentag', function (node) {
    prevTag = currentTag
    currentTag = node.name
    hasAttributes = !!node.attributes

    if (!withinItem) {
      item = {}
    }
  })

  saxStream.on('closetag', function (tag) {
    chunk = JSON.stringify(item)

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
}

function getTag(tag) {
  return tags[tag] || tag
}

function getItem(tag, text) {
  var item = '{ "' + tag + '": "' + text + '" }, '

  return item
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

module.exports = new Radio()
