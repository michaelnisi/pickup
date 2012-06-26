// pickup - stream podcast RSS to JSON

var inherits = require('inherits')
,   Stream = require('stream').Stream
,   saxStream = require('sax').createStream(true, { trim: true })
,   stringify = require('JSONStream').stringify()

module.exports = function () {
  return new Pickup()
}

function Pickup () {
  Stream.call(this)

  var me = this
  ,   currentTag = null
  ,   item = null
  ,   withinItem = false

  me.readable = me.writable = true

  stringify.on('data', function (chunk) {
    me.emit('data', chunk)
  })

  stringify.on('end', function () {
    me.emit('end')
  })

  saxStream.on('end', function () {
    stringify.write({ key: 'response', value: 200 })
    stringify.end()
  })

  saxStream.on('error', function (err) {
    me.emit('error', err)
  })
  
  saxStream.on('opentag', function (node) {
    var tag = getTag(node.name)
    
    if (isIgnored(tag)) {
      if (!withinItem) item = null
      return
    }

    currentTag = tag
    
    if (tag === 'item') withinItem = true

    if (withinItem) {
      if (!item) item = { key:tag }
      if (tag != 'item') item[tag] = node.attributes
    } else {
      item = { key:tag, value:node.attributes }
    }
  })

  saxStream.on('closetag', function (tag) {
    tag = getTag(tag)
    
    if (isIgnored(tag)) return
    
    if (tag === 'item') withinItem = false
    if (!withinItem) stringify.write(item)
  })

  saxStream.on('text', function (text) {
    if (!item) return
    
    if (withinItem) {
      item[currentTag] = text
    } else {
      item.value = text 
    }
  })  
}

// Relevant tags
var relevants = {
  'title': true
, 'link': true
, 'language': true
, 'copyright': true
, 'subtitle': true
, 'author': true
, 'summary': true
, 'item': true
, 'guid': true
, 'enclosure': true
}

function isIgnored(tag) {
  return !relevants[tag]
}

// Replaced tags
var replacements = { 
  'itunes:summary': 'summary'
, 'itunes:author': 'author' 
, 'itunes:duration': 'duration'
, 'itunes:keywords': 'keywords'
, 'itunes:subtitle': 'subtitle'
, 'itunes:image': 'image'
, 'itunes:name': 'name'
, 'itunes:email': 'email'
, 'content:encoded': 'content'
}

function getTag(tag) {
  return replacements[tag] || tag
}

inherits(Pickup, Stream)

Pickup.prototype.write = function (data) {
  saxStream.write(data)
}

Pickup.prototype.end = function () {
  saxStream.end()
}

Pickup.prototype.destroy = function () {
}

