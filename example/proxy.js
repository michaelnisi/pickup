var http = require('http')
,   url = require('url')
,   request = require('request')
,   pickup = require('../lib/pickup.js')()
  
pickup.on('error', function (err) {
  console.error(err)
})

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

  req.on('close', function () {
    pickup.end()
  })

  resp.on('close', function () {
    pickup.end()
  })
}).listen(8080, '127.0.0.1')
