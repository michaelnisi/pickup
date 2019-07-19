'use strict'

module.exports.Entry = Entry
module.exports.Feed = Feed

function Entry (
  author,
  duration,
  enclosure,
  id,
  image,
  link,
  originalURL,
  subtitle,
  summary,
  title,
  updated,
  url
) {
  this.author = author
  this.duration = duration
  this.enclosure = enclosure
  this.id = id
  this.image = image
  this.link = link
  this.originalURL = originalURL
  this.subtitle = subtitle
  this.summary = summary
  this.title = title
  this.updated = updated
  this.url = url
}

function Feed (
  author,
  copyright,
  id,
  image,
  language,
  link,
  originalURL,
  payment,
  subtitle,
  summary,
  title,
  ttl,
  updated,
  url
) {
  this.author = author
  this.copyright = copyright
  this.id = id
  this.image = image
  this.language = language
  this.link = link
  this.originalURL = originalURL
  this.payment = payment
  this.subtitle = subtitle
  this.summary = summary
  this.title = title
  this.ttl = ttl
  this.updated = updated
  this.url = url
}
