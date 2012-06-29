// pickup - stream podcast RSS to JSON

var sax = require('sax')
,   ignored = require('./ignored.js')
,   replace = require('./replace.js')
,   stringify  = require('./stringify.js')

module.exports = function () {
  var currentTag = null
  ,   item = null
  ,   withinItem = false
  ,   isIgnored = true
  ,   parser = sax.parser(true, { trim: true })
  ,   stream = stringify(parser)
  
  parser.onerror = function (err) {
    stream.emit('error', err)
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
    if (!withinItem) stream.update(item)
  }

  parser.ontext = function (text) {
    if (isIgnored || !item) return
    
    if (withinItem) {
      item.value[currentTag] = text
    } else {
      item.value = text 
    }
  }

  return stream  
}
