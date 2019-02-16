'use strict'

// parse <![CDATA[]]>

const parse = require('./lib/parse')
const pickup = require('../')
const { test } = require('tap')

test('media-thumbnail', (t) => {
  const xml =
    `<rss><channel>
       <item>
         <description><![CDATA[<sender>John Smith</sender>]]></description>
       </item>'
    </channel></rss>`

  const wanted = [
    ['entry', pickup.entry({ summary: '<sender>John Smith</sender>' })],
    ['feed', {}],
    ['finish'],
    ['end']
  ]

  parse({ t: t, xml: xml, wanted: wanted }, (er) => {
    t.ok(!er)
    t.end()
  })
})

test('whitespace', (t) => {
  const xml =
    `<rss><channel>
       <item>
         <content:encoded>
           <![CDATA[spacetime is four dimensional]]>
         </content:encoded>
       </item>'
    </channel></rss>`

  const wanted = [
    ['entry', pickup.entry({ summary: 'spacetime is four dimensional' })],
    ['feed', {}],
    ['finish'],
    ['end']
  ]

  parse({ t: t, xml: xml, wanted: wanted }, (er) => {
    t.ok(!er)
    t.end()
  })
})
