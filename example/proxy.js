// proxy - HTTP proxy server

var http = require('http')
var pickup = require('../')

http.createServer(function (req, res) {
  http.get('http:/'.concat(req.url), function (feed) {
    feed.pipe(pickup()).pipe(res)
  })
}).listen(8080)
