var http = require('http')
,   url = require('url')
,   request = require('request')
,   pickup = require('../lib/pickup.js')()
  
http.createServer(function (req, resp) {
  req.on('end', function () {
    var uri = url.parse(req.url, true).query.uri
    if (!uri) {
      resp.writeHead(400)
      resp.end()
      return
    }  
    request(uri).pipe(pickup).pipe(resp)  
  })
}).listen(8080, '127.0.0.1')
