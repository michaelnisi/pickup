// pickup - stream podcast RSS to JSON

var inherits = require('inherits')
,   Stream = require('stream').Stream
,   saxStream = require('sax').createStream(true, { trim: true })
,   first = true

var stringify = function () {
  var op = '[\n'
  ,   sep = '\n,\n'
  ,   cl = '\n]\n'
  
  var stream = new Stream ()
    , ended = false
    , anyData = false

  stream.write = function (data) {
    anyData = true
    var json = JSON.stringify(data)
    if(first) { first = false ; stream.emit('data', op + json)}
    else stream.emit('data', sep + json)
  }
  stream.end = function (data) {
    if(data) stream.write(data)
    if(!anyData) stream.emit('data', op)
    stream.emit('data', cl)
    stream.emit('end')
  }
  stream.writable = true
  stream.readable = true

  return stream
}()

module.exports = function () {
  return new Pickup()
}

function Pickup () {
  Stream.call(this)

  var me = this
  ,   currentTag = null
  ,   item = null
  ,   withinItem = false
  ,   ignored = true

  me.readable = me.writable = true

  stringify.on('data', function (chunk) {
    me.emit('data', chunk)
  })

  stringify.on('end', function () {
    me.emit('end')
    first = true
  })

  stringify.on('error', function (err) {
    me.emit(err)
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
    
    ignored = isIgnored(tag)

    if (ignored) {
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
  })

  saxStream.on('closetag', function (tag) {
    tag = getTag(tag)
    
    if (isIgnored(tag)) return
    
    if (tag === 'item') withinItem = false
    if (!withinItem) stringify.write(item)
  })

  saxStream.on('text', function (text) {
    if (ignored || !item) return
    
    if (withinItem) {
      item.value[currentTag] = text
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
, 'description': true
, 'item': true
, 'guid': true
, 'enclosure': true
, 'image': true
, 'pubDate': true
, 'duration': true
, 'keywords': true
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

Pickup.prototype.write = function (chunk) {
  saxStream.write(chunk)
}

Pickup.prototype.end = function () {
  saxStream.end()
}

Pickup.prototype.pause = function () {
}

Pickup.prototype.resume = function () {
}

Pickup.prototype.destroy = function () {
}

