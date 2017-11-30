var fs   = require('fs')
var zlib = require('zlib')
var strs = require('stringstream')

//part 1 将massiveLogFile.gz 压缩文件中的数据转换为utf-8格式输出
var utf8Stream = fs.createReadStream('massiveLogFile.gz')
  .pipe(zlib.createGunzip())
  .pipe(strs('utf8'))

utf8Stream.pipe(process.stdout)

//part2 将myFile文件中的数据由utf-8格式转换为hex格式，再转换为base64格式 输出
// Stream from utf8 to hex to base64... Why not, ay.
var hex64Stream = fs.createReadStream('myFile')
  .pipe(strs('utf8', 'hex'))
  .pipe(strs('hex', 'base64'))

hex64Stream.pipe(process.stdout)

//part 3 将myfile文件中的数据转化为base64格式 存在stream中，   
// Deals with base64 correctly by aligning chunks
var stream = fs.createReadStream('myFile').pipe(strs('base64'))

var base64Str = ''

stream.on('data', function(data) { base64Str += data })
stream.on('end', function() {
  console.log('My base64 encoded file is: ' + base64Str) // Wouldn't work with setEncoding()
  console.log('Original file is: ' + new Buffer(base64Str, 'base64'))
})
