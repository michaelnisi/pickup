var http = require('http')
,   request = require('request')
,   radio = require('../lib/radio.js')()
,   url = 'http://chaosradio.ccc.de/chaosradio_international-latest.rss'

http.createServer(function (req, resp) {
  request(url).pipe(radio).pipe(resp)
}).listen(8080, '127.0.0.1')
