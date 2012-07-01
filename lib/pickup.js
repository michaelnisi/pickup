module.exports = pickup

var sax = require('sax')
,   relevant = require('./relevant.js')
,   replace = require('./replace.js')
,   stringify  = require('./stringify.js')

function pickup () {
  var currentTag = null
  ,   item = null
  ,   withinItem = false
  ,   ignored = true
  ,   parser = sax.parser(true, { trim: true })
  ,   stream = stringify(parser)
 
  parser.onopentag = function (node) {
    var tag = replace(node.name)
    
    ignored = !relevant(tag)

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
  }

  parser.onclosetag = function (tag) {
    tag = replace(tag)
    
    if (!relevant(tag)) return
    
    if (tag === 'item') withinItem = false
    if (!withinItem) stream.update(item)
  }

  parser.ontext = function (text) {
    if (ignored || !item) return
    
    if (withinItem) {
      item.value[currentTag] = text
    } else {
      item.value = text 
    }
  }

  return stream  
}
