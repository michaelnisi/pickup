// spin - spin to analyze memory consumption
//
// $ node --trace-gc spin.js

const fs = require('fs')
const path = require('path')
const pickup = require('../')
const stream = require('readable-stream')

const here = path.dirname(module.filename)
const dir = path.join(here, '..', 'test', 'data')
const all = fs.readdirSync(dir)
const xml = all.filter((p) => { return path.extname(p) === '.xml' })
const paths = xml.map((p) => { return path.join(dir, p) })

function rnd (paths) {
  return paths[Math.floor(Math.random() * paths.length)]
}
function parse (p) {
  const reader = fs.createReadStream(p)
  const writer = new stream.PassThrough()
  reader.pipe(pickup()).pipe(writer)
}

setInterval(() => { parse(rnd(paths)) }, 10)
