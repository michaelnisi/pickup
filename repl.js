#!/usr/bin/env node

// repl - explore pickup

var Transform = require('stream').Transform
var fs = require('fs')
var http = require('http')
var pickup = require('./')
var repl = require('repl')
var util = require('util')

var ctx = repl.start({
  prompt: 'pickup> ',
  ignoreUndefined: true,
  input: process.stdin,
  output: process.stdout
}).context

ctx.file = file
ctx.get = get
ctx.read = read

function file (path) {
  return fs.createReadStream(path).pipe(
    pickup({ objectMode: true }))
}

util.inherits(UrlStream, Transform)
function UrlStream (opts) {
  if (!(this instanceof UrlStream)) return new UrlStream(opts)
  Transform.call(this, opts)
}

UrlStream.prototype._transform = function (chunk, enc, cb) {
  var me = this
  http.get(chunk, function (res) {
    var parser = pickup({ objectMode: true })
    parser.on('data', function (chunk) {
      me.push(chunk)
    })
    parser.on('finish', cb)
    res.pipe(parser)
  })
}

function get (url) {
  var stream = new UrlStream({ objectMode: true })
  stream.end(url)
  return stream
}

function read (stream, prop) {
  var obj
  while ((obj = stream.read()) !== null) {
    console.log(util.inspect(
      prop ? obj[prop] : obj, { colors: true }))
  }
}
