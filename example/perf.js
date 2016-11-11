// perf - Measure time

const pickup = require('../')
const fs = require('fs')
const path = require('path')

module.exports.run = run

const dir = path.dirname(module.filename)
const file = path.join(dir, 'df.xml')

function _run (n, cb, times) {
  const time = process.hrtime()
  const reader = fs.createReadStream(file)
  const parser = pickup({ objectMode: true })
  parser.on('finish', () => {
    if (n--) {
      const ns = process.hrtime(time)
      const ms = (ns[0] * 1e9 + ns[1]) / 1e6
      times.push(ms)
      _run(n, cb, times)
    } else {
      const r = times.reduce((a, b) => {
        return a + b
      })
      const avg = r / times.length
      const sorted = times.sort((a, b) => {
        return a - b
      })
      const l = sorted.length
      const med = sorted[Math.round(l / 2)]
      const min = sorted[0]
      const max = sorted[l - 1]
      cb(null, { med: med, min: min, max: max, avg: avg })
    }
  })
  let ok = true
  function write () {
    if (!ok) return
    let chunk
    while ((chunk = reader.read()) !== null) {
      ok = parser.write(chunk)
    }
    if (!ok) {
      parser.once('drain', () => {
        ok = true
        write()
      })
    }
  }
  reader.on('readable', write)
  reader.once('end', () => {
    reader.removeListener('readable', write)
    parser.end()
  })
}

function run (n, cb) {
  _run(n, cb, [])
}

if (require.main === module) {
  console.log('One moment, please.')
  run(100, (er, z) => {
    Object.getOwnPropertyNames(z).forEach((name) => {
      z[name] = z[name].toFixed(2)
    })
    console.log(
      'Range: %d - %d ms\n' +
      'Median: %d ms\n' +
      'Average: %d ms'
    , z.min, z.max, z.med, z.avg)
  })
}
