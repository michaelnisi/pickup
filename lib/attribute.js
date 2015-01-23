
// attribute - filter attributes

module.exports = attribute

function link (key, attributes) {
  var rel = attributes.rel
  var value = null
  if (rel === 'payment') {
    key = rel
  }
  if (rel === 'enclosure') {
    key = rel
    value = attributes
    delete value.rel
  } else {
    value = attributes.href
  }
  return [key, value]
}

function image (key, attributes) {
  return [key, attributes.href || attributes.url]
}

var handlers = {
  'link':link
, 'image':image
}

function attribute (key, attributes) {
  var value = attributes
  if (handlers.hasOwnProperty(key)) {
    return handlers[key](key, attributes)
  }
  return [key, value]
}
