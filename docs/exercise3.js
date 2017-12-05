//base64
var fs   = require('fs')
var zlib = require('zlib')
var strs = require('stringstream')

var stream = fs.createReadStream('myFile').pipe(strs('base64'))
var base64Str = ''

stream.on('data', function(data) { base64Str += data })
stream.on('end', function() {
     console.log('My base64 encoded file is: ' + base64Str) // Wouldn't work with setEncoding()
     console.log('Original file is: ' + new Buffer(base64Str, 'base64'))
})
