
// maps - map elements

module.exports = function () {
  var channel = {
    'title':'title'
  , 'description':'description'
  , 'link':'link'
  , 'language':'language'
  , 'pubDate':'pubDate'
  , 'lastBuildDate':'lastBuildDate'
  , 'docs':'docs'
  , 'generator':'generator'
  , 'managingEditor':'managingEditor'
  , 'webMaster':'webMaster'
  , 'ttl':'ttl'
  , 'image':'image'
  , 'rating':'rating'
  , 'textInput':'textInput'
  , 'skipHours':'skipHours'
  , 'skipDays':'skipDays'
  , 'itunes:author':'author'
  , 'itunes:summary':'summary'
  , 'itunes:subtitle':'subtitle'
  }

  var item = {
    'title':'title'
  , 'link':'link'
  , 'description':'description'
  , 'pubDate':'pubDate'
  , 'guid':'guid'
  , 'enclosure':'enclosure'
  , 'author':'author'
  , 'category':'category'
  , 'comments':'comments'
  , 'source':'source'
  , 'itunes:subtitle':'subtitle'
  , 'itunes:author':'author'
  , 'itunes:summary':'summary'
  , 'itunes:duration':'duration'
  , 'itunes:keywords':'keywords'
  , 'itunes:image':'image'
  }

  var feed = {
    'title':'title'
  , 'subtitle':'subtitle'
  , 'link':'link'
  , 'id':'id'
  , 'updated':'updated'
  }

  var entry = {
    'title':'title'
  , 'link':'link'
  , 'id':'id'
  , 'updated':'summary'
  , 'name':'author'
  , 'email':'email'
  }

  var maps = {
    channel:channel
  , item:item
  , feed:feed
  , entry:entry
  }

  return maps
}
