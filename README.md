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

Handles input and output encoding:

不需要处理 setEncoding() ，只要让他们按照应该做的组成streams流。

Handles input and output encoding:

处理输入和输出编码：
