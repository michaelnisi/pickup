
// mappings - map elements to property names

module.exports = function () {
  var channel = {
    'description':'summary'
  , 'image':'image'
  , 'itunes:author':'author'
  , 'itunes:subtitle':'subtitle'
  , 'itunes:summary':'summary'
  , 'language':'language'
  , 'link':'link'
  , 'atom:link':'link'
  , 'pubDate':'updated'
  , 'title':'title'
  , 'ttl':'ttl'
  }

  var item = {
    'author':'author'
  , 'description':'summary'
  , 'enclosure':'enclosure'
  , 'guid':'id'
  , 'itunes:author':'author'
  , 'itunes:duration':'duration'
  , 'itunes:image':'image'
  , 'itunes:subtitle':'subtitle'
  , 'itunes:summary':'summary'
  , 'link':'link'
  , 'pubDate':'updated'
  , 'title':'title'
  }

  var feed = {
    'title':'title'
  , 'subtitle':'subtitle'
  , 'link':'link'
  , 'id':'id'
  , 'updated':'updated'
  , 'name':'author'
  }

  var entry = {
    'title':'title'
  , 'link':'link'
  , 'id':'id'
  , 'updated':'updated'
  , 'summary':'summary'
  , 'email':'author'
  }

  var enclosure = {
    'type':'type'
  , 'length':'length'
  , 'href':'href'
  }

  var mappings = {
    channel:channel
  , item:item
  , feed:feed
  , entry:entry
  , enclosure:enclosure
  }

  return mappings
}
