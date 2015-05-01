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
  if (key === 'enclosure' || rel === 'enclosure') {
    return enclosure('enclosure', attributes)
  }
  if (rel && rel !== 'alternate' && rel !== 'payment') return
  if (rel === 'payment') key = rel
  if (key === 'link' || key === 'payment') {
    var uri = href(attributes)
    return [key, uri]
  }
}

function image (key, attributes) {
  return [key, href(attributes)]
}

var handlers = {
  link: link,
  image: image,
  enclosure: enclosure
}

function attribute (key, attributes) {
  if (handlers.hasOwnProperty(key)) {
    return handlers[key](key, attributes)
  }
}
