// proxy - HTTP proxy server

const http = require('http')
const https = require('https')
const pickup = require('../')

http.createServer((req, res) => {
  https.get('https:/'.concat(req.url), (feed) => {
    feed.pipe(pickup()).pipe(res)
  })
}).listen(8080)
