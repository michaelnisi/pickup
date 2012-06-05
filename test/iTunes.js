var request = require('request')
,   opts = {}
,   radio = require('../lib/radio.js')(opts)
,   test = require('tap').test
,   path = 'iTunes.xml'
,   fstream = require('fs').createReadStream(path)

test('iTunes', function (t) {
  var json = ''
 
  fstream.pipe(radio)

  radio.on('data', function (data) {
    json += data
  })

  radio.on('end', function () {
    var result = JSON.parse(json)
   
    t.equal(result.title, 'All About Everything')

    // t.ok(result.items, 'should have items')
    // t.equal(result.items.length, 3)
    // t.equal(firstItem.title, 'Shake Shake Shake Your Spices')
    // t.equal(firstItem.author, 'John Doe')
    // t.equal(firstItem.subtitle, 'A short primer on table spices')
    
    // t.equal(enclosure.length, '8727310')
    
    t.end()
  })
})
