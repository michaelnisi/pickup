module.exports = replace

var replacements = { 
  'itunes:summary': 'summary'
, 'itunes:author': 'author' 
, 'itunes:duration': 'duration'
, 'itunes:keywords': 'keywords'
, 'itunes:subtitle': 'subtitle'
, 'itunes:image': 'image'
, 'itunes:name': 'name'
, 'itunes:email': 'email'
, 'content:encoded': 'content'
}

function replace (tag) {
  return replacements[tag] || tag
}
