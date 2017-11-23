# nodejs-Code-interpretation
nodejs大作业相关内容
## Todo
读 StringStream.js 并分析
## 选题：StringStream 
将流解码为字符串正确的方法

    var fs   = require('fs')
    var zlib = require('zlib')
    var strs = require('stringstream')

    var utf8Stream = fs.createReadStream('massiveLogFile.gz')
      .pipe(zlib.createGunzip())
      .pipe(strs('utf8'))
No need to deal with setEncoding() weirdness, just compose streams like they were supposed to be!

不需要处理 setEncoding() ，只要让他们按照应该做的组成streams流。

Handles input and output encoding:

处理输入和输出编码：

    //Stream from utf8 to hex to base64... Why not, ay.
    var hex64Stream = fs.createReadStream('myFile')
      .pipe(strs('utf8', 'hex'))
      .pipe(strs('hex', 'base64'))
      
Also deals with base64 output correctly by aligning each emitted data chunk so that there are no dangling = characters:

base64 通过对齐每个发出的数据块来正确处理输出，以便不存在 悬挂=字符：

    var stream = fs.createReadStream('myFile').pipe(strs('base64'))
    var base64Str = ''

    stream.on('data', function(data) { base64Str += data })
    stream.on('end', function() {
         console.log('My base64 encoded file is: ' + base64Str) // Wouldn't work with setEncoding()
         console.log('Original file is: ' + new Buffer(base64Str, 'base64'))
    })
