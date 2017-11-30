//将myfile中的utf-8数据转换为hex 再转换为 base64 格式 输出 
var hex64Stream = fs.createReadStream('myFile')
  .pipe(strs('utf8', 'hex'))
  .pipe(strs('hex', 'base64'))

hex64Stream.pipe(process.stdout)
