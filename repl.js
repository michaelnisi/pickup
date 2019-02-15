#!/usr/bin/env node

// repl - evaluate pickup

const fs = require('fs')
const http = require('http')
const https = require('https')
const repl = require('repl')
const url = require('url')
const { Pickup, Feed, Entry } = require('./')
const { inspect } = require('util')
const { pipeline, Writable } = require('readable-stream')

const server = repl.start({
  ignoreUndefined: true,
  input: process.stdin,
  output: process.stdout,
  prompt: 'pickup> ',
  useColors: true
})

function file (path) {
  return fs.createReadStream(path).pipe(
    new Pickup({ objectMode: true })
  )
}

function get (uri) {
  const urlObj = url.parse(uri)
  const mod = urlObj.protocol === 'http:' ? http : https

  const parser = new Pickup({ objectMode: true })

  mod.get(urlObj, (res) => {
    res.pipe(parser)
  })

  return parser
}

// Reads all data of type from parser matching key. You can skip type or pass
// Feed or Entry for only seeing to those. You might also limit messages.
function read (parser, type, key, limit = Infinity) {
  let count = 0

  pipeline(parser, new Writable({
    write (obj, enc, cb) {
      if (typeof type === 'string') key = type

      if (typeof type === 'number') {
        limit = type
        type = undefined
      }

      if (typeof key === 'number') {
        limit = key
        key = undefined
      }

      if (count >= limit) {
        return cb()
      }

      if (type instanceof Object && !(obj instanceof type)) {
        return cb()
      }

      console.log(inspect(key ? obj[key] : obj, { colors: true }))
      count++

      cb()
    },
    objectMode: true
  }), er => {
    console.log(er || 'ok')
    server.displayPrompt()
  })
}

function clear () {
  process.stdout.write('\u001B[2J\u001B[0;0f')
}

const ctx = server.context

ctx.Entry = Entry
ctx.Feed = Feed
ctx.clear = clear
ctx.file = file
ctx.get = get
ctx.read = read
