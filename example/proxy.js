var request = require('request')
,   pickup = require('../lib/radio.js')()
,   url = 'http://feeds.feedburner.com/back2work'

request(url).pipe(pickup).pipe(process.stdout)
