
// mappings - map elements to property names

module.exports = function () {
  var channel = {
    'atom:link':'link'
  , 'copyright':'copyright'
  , 'description':'summary'
  , 'image':'image'
  , 'itunes:author':'author'
  , 'itunes:image':'image'
  , 'itunes:subtitle':'subtitle'
  , 'itunes:summary':'summary'
  , 'language':'language'
  , 'link':'link'
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
    'id':'id'
  , 'link':'link'
  , 'name':'author'
  , 'subtitle':'subtitle'
  , 'title':'title'
  , 'updated':'updated'
  }

  var entry = {
    'email':'author'
  , 'id':'id'
  , 'link':'link'
  , 'summary':'summary'
  , 'title':'title'
  , 'updated':'updated'
  }

  var mappings = {
    channel:channel
  , item:item
  , feed:feed
  , entry:entry
  }

  return mappings
}()
