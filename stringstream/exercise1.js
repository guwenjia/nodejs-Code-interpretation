var fs   = require('fs')
var zlib = require('zlib')
var strs = require('stringstream')


var hexStream = fs.createReadStream('myFile').pipe(strs('hex'));

hexStream.pipe(process.stdout)
