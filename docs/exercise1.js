//将myfile中的数据转换为hex编码格式 输出
var fs   = require('fs')
var zlib = require('zlib')
var strs = require('stringstream')


var hexStream = fs.createReadStream('myFile').pipe(strs('hex'));

hexStream.pipe(process.stdout)
