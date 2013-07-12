var http = require('http')
  , url = require('url')
  , pickup = require('../')

http.createServer(function (req, res) {
  http.get(url.parse('http:/' + req.url), function (feed) {
    feed.pipe(pickup()).pipe(res)
  }).end()
}).listen(8080)
