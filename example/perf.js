// perf - Measure time

var pickup = require('../')
var fs = require('fs')
var path = require('path')

module.exports.run = run

var dir = path.dirname(module.filename)
var file = path.join(dir, 'df.xml')

function _run (n, cb, times) {
  var time = process.hrtime()
  var reader = fs.createReadStream(file)
  var parser = pickup({ objectMode: true })
  parser.on('finish', function () {
    if (n--) {
      var ns = process.hrtime(time)
      var ms = (ns[0] * 1e9 + ns[1]) / 1e6
      times.push(ms)
      _run(n, cb, times)
    } else {
      var r = times.reduce(function (a, b) {
        return a + b
      })
      var avg = r / times.length
      var sorted = times.sort(function (a, b) {
        return a - b
      })
      var l = sorted.length
      var med = sorted[Math.round(l / 2)]
      var min = sorted[0]
      var max = sorted[l - 1]
      cb(null, { med: med, min: min, max: max, avg: avg })
    }
  })
  var ok = true
  function write () {
    if (!ok) return
    var chunk
    while ((chunk = reader.read()) !== null) {
      ok = parser.write(chunk)
    }
    if (!ok) {
      parser.once('drain', function () {
        ok = true
        write()
      })
    }
  }
  reader.on('readable', write)
  reader.once('end', function () {
    reader.removeListener('readable', write)
    parser.end()
  })
}

function run (n, cb) {
  _run(n, cb, [])
}

if (require.main === module) {
  console.log('One moment, please.')
  run(100, function (er, z) {
    Object.getOwnPropertyNames(z).forEach(function (name) {
      z[name] = z[name].toFixed(2)
    })
    console.log(
      'Range: %d - %d ms\n'
    + 'Median: %d ms\n'
    + 'Average: %d ms'
    , z.min, z.max, z.med, z.avg)
  })
}
