#!/usr/bin/env node

// repl - explore pickup

const fs = require('fs')
const http = require('http')
const https = require('https')
const pickup = require('./')
const repl = require('repl')
const url = require('url')
const util = require('util')

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

function file (path) {
  return fs.createReadStream(path).pipe(pickup({ objectMode: true }))
}

function get (uri) {
  const urlObj = url.parse(uri)
  const mod = urlObj.protocol === 'http:' ? http : https

  const parser = pickup({ objectMode: true })

  mod.get(urlObj, (res) => {
    res.pipe(parser)
  })

  return parser
}

function read (stream, prop) {
  stream.on('readable', () => {
    const obj = stream.read()
    if (obj === null) {
      return
    }
    console.log(util.inspect(prop ? obj[prop] : obj, { colors: true }))
  })
}
