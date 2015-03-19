
// attribute - whitelist attributes

module.exports = attribute

function href (attributes) {
  return attributes.href || attributes.url
}

function Enclosure (attributes) {
  this.url = href(attributes)
  this.length = attributes.length
  this.type = attributes.type
}
function enclosure (key, attributes) {
  return [key, new Enclosure(attributes)]
}

function link (key, attributes) {
  var rel = attributes.rel
  if (rel !== 'self' && rel !== 'alternate') {
    key = rel || key
  }
  if (key === 'enclosure') {
    return enclosure(key, attributes)
  }
  if (key === 'link' || key === 'payment') {
    return [key, href(attributes)]
  }
}

function image (key, attributes) {
  return [key, href(attributes)]
}

var handlers = {
  link: link
, image:image
, enclosure:enclosure
}

function attribute (key, attributes) {
  var value = attributes
  if (handlers.hasOwnProperty(key)) {
    return handlers[key](key, attributes)
  }
}
