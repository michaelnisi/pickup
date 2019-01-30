#!/usr/bin/env node

// repl - explore pickup

const fs = require('fs')
const http = require('http')
const https = require('https')
const repl = require('repl')
const url = require('url')
const util = require('util')

const { Pickup, Feed, Entry } = require('./')

const ctx = repl.start({
  ignoreUndefined: true,
  input: process.stdin,
  output: process.stdout,
  prompt: 'pickup> ',
  useColors: true
}).context

ctx.file = file
ctx.get = get
ctx.read = read
ctx.Entry = Entry
ctx.Feed = Feed

function file (path) {
  return fs.createReadStream(path).pipe(Pickup({ objectMode: true }))
}

function get (uri) {
  const urlObj = url.parse(uri)
  const mod = urlObj.protocol === 'http:' ? http : https

  const parser = Pickup({ objectMode: true })

  mod.get(urlObj, (res) => {
    res.pipe(parser)
  })

  return parser
}

// Reads all data of type from parser matching key. If type is not an Object,
// it replaces key, allowing you to just pass a key.
function read (parser, type, key) {
  parser.on('data', (obj) => {
    if (typeof type === 'string') key = type

    if (type instanceof Object && !(obj instanceof type)) return
    console.log(util.inspect(key ? obj[key] : obj, { colors: true }))
  })
}
