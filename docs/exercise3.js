//base64
var fs   = require('fs')
var zlib = require('zlib')
var strs = require('stringstream')

var stream = fs.createReadStream('myFile').pipe(strs('base64'))  //myFile里的内容是： hi how are you?
var base64Str = 'aGVsbG8='  //hello

stream.on('data', function(data) { base64Str += data })
stream.on('end', function() {
     console.log('My base64 encoded file is: ' + base64Str) // Wouldn't work with setEncoding()
     console.log('Original file is: ' + new Buffer(base64Str, 'base64'))
})

//输出：                        
My base64 encoded file is: aGVsbG8=aGkgaG93IGFyZSB5b3U/Cg==   
Original file is: hello           //??为什么不是 hellohi how are you?

