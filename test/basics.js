var request = require('request')
,   radio = require('../lib/radio.js')
,   test = require('tap').test
,   path = 'feed.xml'
,   fstream = require('fs').createReadStream(path)

test('items', function (t) {
  var json = ''
 
  fstream.pipe(radio)

  radio.on('data', function (data) {
    json += data
  })

  radio.on('end', function () {
    var result = JSON.parse(json)
    ,   firstItem = result.items[0]
    
    t.ok(result.items, 'should have items')
    t.equal(result.items.length, 3, 'should be 3')
    t.equal(firstItem.title, 'Shake Shake Shake Your Spices')
    t.equal(firstItem.author, 'John Doe')
    t.equal(firstItem.subtitle, 'A short primer on table spices')
    
    var enclosure = firstItem.enclosure
    t.equal(enclosure.length, '8727310', 'should be 8727310')
    
    t.end()
  })
})
