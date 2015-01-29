
// spin - kick the tires
// $ node --trace-gc spin.js

var fs = require('fs')
var path = require('path')
var pickup = require('./')
var stream = require('readable-stream')

function setup () {
  var dir = './test/data'
  var all = fs.readdirSync(dir)
  var xml = all.filter(function (p) {
    return path.extname(p) === '.xml'
  })
  return xml.map(function (p) {
    return path.join(dir, p)
  })
}

function rnd (paths) {
  return paths[Math.floor(Math.random() * paths.length)]
}
function parse (p) {
  var reader = fs.createReadStream(p)
  var writer = new stream.PassThrough()
  reader.pipe(pickup()).pipe(writer)
}
var paths = setup()
setInterval(function () {
  parse(rnd(paths))
}, 100)
