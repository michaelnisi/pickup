var pickup = require('../lib/pickup.js')()

process.openStdin().pipe(pickup).pipe(process.stdout)
