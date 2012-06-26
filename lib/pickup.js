// pickup - transform podcast RSS to JSON

var inherits = require('inherits')
,   Stream = require('stream').Stream
,   strict = true
,   options = { trim: true }
,   saxStream = require('sax').createStream(strict, options)

module.exports = function () {
  return new Pickup()
}

function Pickup () {
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

  saxStream.on('end', function () {
    me.emit('end')
  })

  saxStream.on('error', function (err) {
    me.emit('error', err)
  })

  saxStream.on('opentag', function (node) {
    var tag = getTag(node.name)

    if (isIgnored(tag)) return

    prevTag = currentTag
    currentTag = tag
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
    tag = getTag(tag)
    
    if (tag === 'rss') me.emit('data', '}')
    if (isIgnored(tag)) return

    chunk = JSON.stringify(item)
    chunk = (isFirstNode ? '{' : ',') + chunk.substr(1, chunk.length - 2)

    if (isFirstItem) {
      '"items":[' + chunk
    }

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

// Relevant tags
var relevants = {
  'title': true
, 'link': true
, 'language': true
, 'copyright': true
, 'subtitle': true
, 'author': true
, 'summary': true
}

function isIgnored(tag) {
  return !relevants[tag]
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

inherits(Pickup, Stream)

Pickup.prototype.write = function (data) {
  saxStream.write(data)
}

Pickup.prototype.end = function () {
  saxStream.end()
}

Pickup.prototype.destroy = function () {
}

