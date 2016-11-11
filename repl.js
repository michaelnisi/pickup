#!/usr/bin/env node

// repl - explore pickup

const Transform = require('stream').Transform
const fs = require('fs')
const http = require('http')
const pickup = require('./')
const repl = require('repl')
const util = require('util')

const ctx = repl.start({
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
  http.get(chunk, (res) => {
    const parser = pickup({ objectMode: true })
    parser.on('data', (chunk) => {
      this.push(chunk)
    })
    parser.on('finish', cb)
    res.pipe(parser)
  })
}

function get (url) {
  const stream = new UrlStream({ objectMode: true })
  stream.end(url)
  return stream
}

function read (stream, prop) {
  let obj
  while ((obj = stream.read()) !== null) {
    console.log(util.inspect(
      prop ? obj[prop] : obj, { colors: true }))
  }
}
