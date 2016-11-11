// proxy - HTTP proxy server

const http = require('http')
const pickup = require('../')

http.createServer((req, res) => {
  http.get('http:/'.concat(req.url), (feed) => {
    feed.pipe(pickup()).pipe(res)
  })
}).listen(8080)
