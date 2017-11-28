//   stringstream
//
//

//引入util模块  util 是一个Node.js 核心模块，提供常用函数的集合，用于弥补核心JavaScript 的功能 过于精简的不足。
var util = require('util')

//引入stream模块  流（stream）在 Node.js 中是处理流数据的抽象接口（abstract interface）。 
//stream 模块提供了基础的 API 。使用这些 API 可以很容易地来构建实现流接口的对象。
var Stream = require('stream')

//引入string_decoder模块（字符串解码器） 该string_decoder模块提供了一种用于将Buffer对象解码为字符串的API，以保留已编码的多字节UTF-8和UTF-16字符的方式。
//string_decoder模块用于将Buffer转成对应的字符串。使用者通过调用stringDecoder.write(buffer)，可以获得buffer对应的字符串。
var StringDecoder = require('string_decoder').StringDecoder

//模块接口 暴露StringStream 和 AlignedStringDecoder
module.exports = StringStream
module.exports.AlignedStringDecoder = AlignedStringDecoder

//定义 StringStream
//this 客户端为 `window`, 服务端(node) 中为 `exports`
function StringStream(from, to) {
  if (!(this instanceof StringStream)) return new StringStream(from, to)

  Stream.call(this)

  if (from == null) from = 'utf8'
  
  //可读 可写
  this.readable = this.writable = true 
  this.paused = false
  this.toEncoding = (to == null ? from : to)
  this.fromEncoding = (to == null ? '' : from)
  this.decoder = new AlignedStringDecoder(this.toEncoding)
}

//util.inherits  一个实现对象间原型继承 的函数
//从一个构造函数中继承原型方法到另一个
//util.inherits(constructor, superConstructor)
//constructor 的原型会被设置到一个从 superConstructor 创建的新对象上。
util.inherits(StringStream, Stream)


//为StringStream添加write方法 
StringStream.prototype.write = function(data) {
  if (!this.writable) {
    var err = new Error('stream not writable')
    err.code = 'EPIPE'
    this.emit('error', err)
    return false
  }
  if (this.fromEncoding) {
    if (Buffer.isBuffer(data)) data = data.toString()
    data = new Buffer(data, this.fromEncoding)
  }
  var string = this.decoder.write(data)
  if (string.length) this.emit('data', string)
  return !this.paused
}

StringStream.prototype.flush = function() {
  if (this.decoder.flush) {
    var string = this.decoder.flush()
    if (string.length) this.emit('data', string)
  }
}

StringStream.prototype.end = function() {
  if (!this.writable && !this.readable) return
  this.flush()
  this.emit('end')
  this.writable = this.readable = false
  this.destroy()
}

StringStream.prototype.destroy = function() {
  this.decoder = null
  this.writable = this.readable = false
  this.emit('close')
}

StringStream.prototype.pause = function() {
  this.paused = true
}

StringStream.prototype.resume = function () {
  if (this.paused) this.emit('drain')
  this.paused = false
}

function AlignedStringDecoder(encoding) {
  StringDecoder.call(this, encoding)

  switch (this.encoding) {
    case 'base64':
      this.write = alignedWrite
      this.alignedBuffer = new Buffer(3)
      this.alignedBytes = 0
      break
  }
}
util.inherits(AlignedStringDecoder, StringDecoder)

AlignedStringDecoder.prototype.flush = function() {
  if (!this.alignedBuffer || !this.alignedBytes) return ''
  var leftover = this.alignedBuffer.toString(this.encoding, 0, this.alignedBytes)
  this.alignedBytes = 0
  return leftover
}

function alignedWrite(buffer) {
  var rem = (this.alignedBytes + buffer.length) % this.alignedBuffer.length
  if (!rem && !this.alignedBytes) return buffer.toString(this.encoding)

  var returnBuffer = new Buffer(this.alignedBytes + buffer.length - rem)

  this.alignedBuffer.copy(returnBuffer, 0, 0, this.alignedBytes)
  buffer.copy(returnBuffer, this.alignedBytes, 0, buffer.length - rem)

  buffer.copy(this.alignedBuffer, 0, buffer.length - rem, buffer.length)
  this.alignedBytes = rem

  return returnBuffer.toString(this.encoding)
}
