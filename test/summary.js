'use strict'

// summary overrides description

const parse = require('./lib/parse')
const pickup = require('../')
const { test } = require('tap')

test('rss', (t) => {
  const xml = [
    '<rss><channel>',
    '<item><description>abc</description><content:encoded>def</content:encoded></item>',
    '<item><content:encoded>def</content:encoded><description>abc</description></item>',
    '</channel></rss>'
  ].join()

  const wanted = [
    ['entry', pickup.entry({ summary: 'def' })],
    ['entry', pickup.entry({ summary: 'def' })],
    ['feed', {}],
    ['readable'],
    ['finish'],
    ['end']
  ]

  parse({ t: t, xml: xml, wanted: wanted }, (er) => {
    t.ok(!er)
    t.end()
  })
})

test('atom', (t) => {
  const xml = [
    '<feed>',
    '<entry><description>abc</description><summary>def</summary></entry>',
    '<entry><summary>def</summary><description>abc</description><content:encoded>def</content:encoded></entry>',
    '</feed>'
  ].join()

  const wanted = [
    ['entry', pickup.entry({ summary: 'def' })],
    ['entry', pickup.entry({ summary: 'def' })],
    ['feed', {}],
    ['readable'],
    ['finish'],
    ['end']
  ]

  parse({ t: t, xml: xml, wanted: wanted }, (er) => {
    t.ok(!er)
    t.end()
  })
})

test('exceeding length', (t) => {
  const xml = [
    '<rss><channel>',
    '<item><description>shorter</description><content:encoded>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam placerat, enim ac gravida bibendum, elit orci tristique lectus, et vehicula orci urna eu eros. Etiam finibus, nibh id facilisis lacinia, dolor turpis suscipit risus, eget facilisis diam odio sit amet magna. Integer consequat massa eget posuere condimentum. Donec sit amet ex dolor. Nulla varius dolor lectus, at suscipit felis interdum a. Aliquam mattis arcu vel dui pellentesque, non rhoncus massa tristique. Vivamus elit neque, condimentum vel urna vitae, pulvinar volutpat velit. Aenean odio odio, hendrerit ut est at, ultricies pretium nisi. Sed ac velit ipsum. Fusce a diam eget dui viverra lobortis cursus non purus. Sed congue velit eget ligula facilisis, a facilisis ipsum sollicitudin. In elit orci, sagittis non ipsum vitae, tempor eleifend mi. Maecenas ut est cursus, accumsan nisl eget, laoreet arcu. In hac habitasse platea dictumst. Etiam ex est, facilisis quis rutrum nec, imperdiet in nisl. Maecenas aliquet libero nulla, vel aliquet nisl auctor in. Curabitur ut eleifend leo, eget tempor urna. Pellentesque ultricies et nulla et egestas. Etiam aliquet efficitur magna, pellentesque laoreet arcu molestie vel. Etiam sed ante orci. Fusce vehicula lectus id odio aliquam bibendum. Donec velit quam, dignissim in porttitor bibendum, sagittis eget turpis. Proin tempor purus neque, nec hendrerit velit elementum sit amet. Morbi ex mi, imperdiet id tristique consectetur, accumsan vel justo. In id metus tincidunt, tincidunt mi tincidunt, pulvinar nisi. Sed mauris nulla, semper non enim eget, dignissim consequat arcu. Sed id elit a enim ultrices accumsan a vitae nibh. Etiam vitae quam at nibh facilisis elementum. Phasellus sed dapibus purus. Donec vitae accumsan ante. Nunc fringilla dui ac mauris aliquam, ut bibendum tortor sagittis. Phasellus cursus eget augue quis dictum. Sed metus lacus, fermentum in gravida non, tristique eget tellus. Cras facilisis lacus id felis mollis ultricies. Curabitur vitae mattis lacus, at accumsan metus. Aliquam erat volutpat. Quisque consectetur erat id ligula efficitur, in sollicitudin metus sollicitudin. Cras est felis, blandit ac lacus sed, condimentum gravida ex. Vivamus erat tortor, tincidunt non mauris eleifend, ultricies lacinia est. Curabitur non orci orci. Aenean ut dolor id urna mattis fringilla. Morbi sed sagittis augue. Phasellus sit amet arcu vitae orci ultricies feugiat. Quisque interdum ultrices mauris et molestie. Aenean neque ex, porttitor sed odio et, convallis molestie diam. Nunc volutpat orci ante, rutrum imperdiet ante fringilla lobortis. Pellentesque et quam magna. Donec luctus at ante in suscipit. Nullam vel dignissim risus, vel pulvinar ligula. Phasellus quis posuere risus. Maecenas blandit felis ac sapien imperdiet maximus. Proin tempus eros vel rhoncus iaculis. Vestibulum aliquam odio in ullamcorper auctor. Duis urna metus, luctus vitae commodo in, malesuada id orci. Cras a odio in augue blandit lobortis in vitae nulla. Cras sit amet luctus dui. Cras facilisis ante sed ultricies commodo. Sed massa enim, elementum in magna id, feugiat auctor sem. Ut rhoncus rhoncus ante eu sagittis. Cras sed elit ipsum. Aliquam vulputate luctus imperdiet. Nunc vel finibus massa. Donec nec tempus felis. Morbi scelerisque pretium ex at ultricies. Donec eget velit ligula. Vivamus eget fringilla augue, in varius sapien. Quisque sed semper lectus. Sed condimentum tortor id ipsum ornare consequat. Integer ac nunc sit amet arcu aliquet pretium eu sit amet leo. Sed sit amet est sed magna consequat rutrum non ut purus. Pellentesque dapibus enim nec arcu pretium, in sollicitudin orci pellentesque. Aenean sed congue dui. Proin sed dui nec metus rutrum maximus vel sit amet risus. Quisque vel blandit nulla, sed dapibus leo. Sed vitae tempor enim. Proin suscipit eros at ipsum posuere, sed porttitor neque luctus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nunc sodales ligula rutrum massa volutpat lacinia. Nulla malesuada, nibh sed rutrum facilisis, dolor est tempor ex, eget varius augue mi vel nisl. Fusce bibendum tempor magna sit amet pellentesque. Vivamus mattis ornare aliquam. Nunc ultrices laoreet odio, varius blandit tortor eleifend quis. Vivamus pulvinar suscipit dui a ullamcorper. Praesent tincidunt sapien eu odio iaculis scelerisque. Aliquam eget venenatis augue. Aliquam tortor felis, interdum ut fermentum vitae, fringilla quis magna. Nam interdum interdum mi, ac vestibulum neque vulputate id. Suspendisse lectus nibh, maximus cursus tincidunt id, condimentum tempus lacus. Vivamus vitae ornare ex, id tincidunt purus. Phasellus pellentesque fringilla ipsum, non interdum enim egestas blandit. In facilisis velit id porttitor lobortis. Phasellus ac augue ut mi eleifend laoreet ut tristique nisl. Nullam viverra dolor dui, ac aliquam eros sodales sit amet. Vestibulum quis convallis velit. Praesent eu accumsan urna. Donec et tellus sit amet felis vestibulum lacinia quis vitae orci. Sed neque nibh, tempor non nibh volutpat.</content:encoded></item>',
    '</channel></rss>'
  ].join()

  const wanted = [
    ['entry', pickup.entry({ summary: 'shorter' })],
    ['feed', {}],
    ['readable'],
    ['finish'],
    ['end']
  ]

  parse({ t: t, xml: xml, wanted: wanted }, (er) => {
    t.ok(!er)
    t.end()
  })
})
