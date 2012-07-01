module.exports = relevant

var relevants = {
  'title': true
, 'link': true
, 'language': true
, 'copyright': true
, 'subtitle': true
, 'author': true
, 'summary': true
, 'description': true
, 'item': true
, 'guid': true
, 'enclosure': true
, 'image': true
, 'pubDate': true
, 'duration': true
, 'keywords': true
}

function relevant (tag) {
  return !!relevants[tag]
}
