const pickup = require('../')

process.stdin
  .pipe(pickup())
  .pipe(process.stdout)
