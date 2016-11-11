'use strict'

// mappings - map elements to property names

module.exports = {
  channel: new Map([
    ['atom:link', 'link'],
    ['copyright', 'copyright'],
    ['description', 'summary'],
    ['image', 'image'],
    ['itunes:author', 'author'],
    ['itunes:image', 'image'],
    ['itunes:subtitle', 'subtitle'],
    ['itunes:summary', 'summary'],
    ['language', 'language'],
    ['link', 'link'],
    ['pubDate', 'updated'],
    ['title', 'title'],
    ['ttl', 'ttl']
  ]),
  item: new Map([
    ['author', 'author'],
    ['description', 'summary'],
    ['enclosure', 'enclosure'],
    ['guid', 'id'],
    ['itunes:author', 'author'],
    ['itunes:duration', 'duration'],
    ['itunes:image', 'image'],
    ['itunes:subtitle', 'subtitle'],
    ['itunes:summary', 'summary'],
    ['link', 'link'],
    ['media:thumbnail', 'image'],
    ['pubDate', 'updated'],
    ['title', 'title']
  ]),
  feed: new Map([
    ['id', 'id'],
    ['link', 'link'],
    ['name', 'author'],
    ['subtitle', 'subtitle'],
    ['title', 'title'],
    ['updated', 'updated']
  ]),
  entry: new Map([
    ['email', 'author'],
    ['id', 'id'],
    ['link', 'link'],
    ['summary', 'summary'],
    ['title', 'title'],
    ['updated', 'updated']
  ])
}
