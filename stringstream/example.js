var fs   = require('fs')
var zlib = require('zlib')
var strs = require('stringstream')

var utf8Stream = fs.createReadStream('massiveLogFile.gz')
  .pipe(zlib.createGunzip())//zlib.createGunzip(options)创建并返回一个带有给定options的新的Gunzip（解压gzip流）对象
  .pipe(strs('utf8'))

utf8Stream.pipe(process.stdout)

//处理输入和输出编码：  
// Stream from utf8 to hex to base64... Why not, ay.
var hex64Stream = fs.createReadStream('myFile')
  .pipe(strs('utf8', 'hex'))
  .pipe(strs('hex', 'base64'))

hex64Stream.pipe(process.stdout)

//base64通过对齐每个发出的数据块来正确处理输出：
// Deals with base64 correctly by aligning chunks
var stream = fs.createReadStream('myFile').pipe(strs('base64'))

var base64Str = 'aGVsbG8='

stream.on('data', function(data) { base64Str += data })
stream.on('end', function() {
  console.log('My base64 encoded file is: ' + base64Str) // Wouldn't work with setEncoding()
  console.log('Original file is: ' + new Buffer(base64Str, 'base64'))
})
