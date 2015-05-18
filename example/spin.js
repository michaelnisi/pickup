// spin - spin to analyze memory consumption
// To run do:
// $ node --trace-gc spin.js

var fs = require('fs')
var path = require('path')
var pickup = require('../')
var stream = require('readable-stream')

var here = path.dirname(module.filename)
var dir = path.join(here, '..', 'test', 'data')
var all = fs.readdirSync(dir)
var xml = all.filter(function (p) {
  return path.extname(p) === '.xml'
})
var paths = xml.map(function (p) {
  return path.join(dir, p)
})

function rnd (paths) {
  return paths[Math.floor(Math.random() * paths.length)]
}
function parse (p) {
  var reader = fs.createReadStream(p)
  var writer = new stream.PassThrough()
  reader.pipe(pickup()).pipe(writer)
}

setInterval(function () {
  parse(rnd(paths))
}, 10)
