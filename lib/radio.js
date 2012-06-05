// radio transforms podcast RSS to JSON

var inherits = require('inherits')
,   Stream = require('stream').Stream
,   strict = true
,   options = { trim: true }
,   saxStream = require('sax').createStream(strict, options)

function Radio (opts) {
  // TODO: set default opts

  Stream.call(this)

  var me = this
  ,   currentTag = null
  ,   prevTag = null
  ,   chunk = null
  ,   hasText = false
  ,   hasAttributes = false
  ,   item = null
  ,   firstItem = undefined
  ,   itemOpened = false
  ,   itemClosed = true
  
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

    if (itemClosed) {
      item = {}
      itemOpened = true
      itemClosed = false
    }
    
    if (tag === 'item') {
      if (firstItem === undefined) {
        firstItem = true
      }
    }
    
    tag = getTag(tag)

    if (hasAttributes) {
      if (tag !== 'item') {
        item[tag] = node.attributes
      }
    }
  })

  saxStream.on('closetag', function (closingTag) {
    itemClosed = tag === closingTag


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

inherits(Radio, Stream)

Radio.prototype.write = function (data) {
  saxStream.write(data)
}

Radio.prototype.pause = function () {
  saxStream.pause()
}

Radio.prototype.resume = function () {
  saxStream.resume()
}

Radio.prototype.end = function () {
  this.emit('end')
}

Radio.prototype.destroy = function () {
}

module.exports = function (opts) {
  return new Radio(opts)
}
