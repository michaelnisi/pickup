// perf - Measure speed

var pickup = require('../')
var fs = require('fs')

module.exports.run = run

function run (n) {
  _run(n, [])
}
function _run (n, times) {
  var time = process.hrtime()
  var readable = fs.createReadStream('./df.xml')
  var writable = pickup({objectMode: true})
  writable.on('finish', function () {
    if (n--) {
      var ns = process.hrtime(time)
      var ms = (ns[0] * 1e9 + ns[1]) / 1e6
      times.push(ms)
      _run(n, times)
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
      console.log(
        'Range %d - %d ms\n'
      + 'Median %d ms\n'
      + 'Average %d ms'
      , min, max, med, avg)
    }
  })
  readable.pipe(writable)
}
run(100)
