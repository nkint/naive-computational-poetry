'use strict'

var _ = require('lodash')
var fs = require('fs')
var FuzzySet = require('fuzzyset.js')

var text = fs.readFileSync('canto_i.txt', 'utf-8').replace(/[^0-9a-z èìàòù]/gi, ' ')

var words = _(text.split(' '))
  .filter(word => word.length >= 2)
  .map(word => word.toLowerCase())
  // .uniq()
  .value()

var dict = {}
var fuzzy = FuzzySet()
for (var i = 0; i < words.length; ++i) {
  const word = words[i]
  fuzzy.add(word)
  if (!(word in dict)) {
    dict[word] = []
  }
  if (i < words.length - 3) {
    dict[word].push([words[i + 1], words[i + 2], words[i + 3]])
  }
}

console.log('Digit a word and flow.\n\n\n')

var stdin = process.openStdin()

stdin.addListener('data', function(d) {
  var input = d.toString().trim()
  var output
  if (!(input in dict)) {
    var similars = _.sortBy(fuzzy.get(input), o => o[0]).map(o => o[1])
    input = _.sample(similars)
  }
  output = _.sample(dict[input])
  output = output ? output.join(' ') : ''
  console.log(output)
})
