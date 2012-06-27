// http://127.0.0.1:8080/?http://feeds.feedburner.com/back2work

var http = require('http')
,   url = require('url')
,   request = require('request')
,   pickup = require('../lib/pickup.js')()
  
http.createServer(function (req, resp) {
  var uri = url.parse(req.url, true).query.url
  if (!uri) {
    resp.writeHead(400)
    resp.end()
    return
  }
  request(uri).pipe(pickup).pipe(resp)  
}).listen(8080, '127.0.0.1')
