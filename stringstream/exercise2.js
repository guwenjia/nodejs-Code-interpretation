var fs   = require('fs')
var zlib = require('zlib')
var strs = require('stringstream')

//处理输入和输出编码：  
// Stream from utf8 to hex to base64... Why not, ay.
var hex64Stream = fs.createReadStream('myFile')
  .pipe(strs('utf8', 'hex'))
  .pipe(strs('hex', 'base64'))

hex64Stream.pipe(process.stdout)


