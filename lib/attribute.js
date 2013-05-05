
// attribute - filter attributes

module.exports = function (key, attributes) {
  var value = attributes
    , handler = handlers[key]

  return handler ? handler(key, attributes) : [key, value]
}

var handlers = {
  'link':link
, 'image':image
}

function link (key, attributes) {
  var rel = attributes.rel
    , value = null

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
  return [key, attributes.href]
}
