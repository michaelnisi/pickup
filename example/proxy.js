var http = require('http')
  , pickup = require('../')
  ;
http.createServer(function (req, res) {
  http.get('http:/'.concat(req.url), function (feed) {
    feed.pipe(pickup()).pipe(res)
  })
}).listen(8080)
