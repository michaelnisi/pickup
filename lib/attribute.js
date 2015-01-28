
// attribute - whitelist attributes

module.exports = attribute

function Enclosure (attributes) {
  this.url = attributes.url || attributes.href
  this.length = attributes.length
  this.type = attributes.type
}
function enclosure (key, attributes) {
  return [key, new Enclosure(attributes)]
}

function link (key, attributes) {
  var rel = attributes.rel
  if (rel !== 'self') {
    key = rel || key
  }
  if (key === 'enclosure') {
    return enclosure(key, attributes)
  }
  if (key === 'link' || key === 'payment') {
    return [key, attributes.href]
  }
}

function image (key, attributes) {
  return [key, attributes.href || attributes.url]
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
