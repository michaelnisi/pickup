#!/usr/bin/env node

// repl - evaluate pickup

const fs = require('fs')
const http = require('http')
const https = require('https')
const repl = require('repl')
const { Pickup, Feed, Entry } = require('./')
const { URL } = require('url')
const { clear, log, dir } = require('console')
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
  const urlObj = new URL(uri)
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

      dir(key ? obj[key] : obj, { colors: true })

      count++

      cb()
    },
    objectMode: true
  }), er => {
    log(er || 'ok')
    server.displayPrompt()
  })
}

const { context } = server

context.Entry = Entry
context.Feed = Feed
context.clear = clear
context.file = file
context.get = get
context.read = read
