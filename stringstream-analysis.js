/*   stringstream    */
/*    将流解码为字符串 */

/**
 *
 util模块 是一个Node.js 核心模块，提供常用函数的集合，用于弥补核心JavaScript 的功能 过于精简的不足。
 *
 @module util
 */
var util = require('util')

/**
 *
 stream模块  流（stream）在 Node.js 中是处理流数据的抽象接口（abstract interface）。 
 stream 模块提供了基础的 API 。使用这些 API 可以很容易地来构建实现流接口的对象。
 *
 @module stream
 */
var Stream = require('stream')

/**
 *
 string_decoder模块（字符串解码器） 该string_decoder模块提供了一种用于将Buffer对象解码为字符串的API，以保留已编码的多字节UTF-8和UTF-16字符的方式。
string_decoder模块用于将Buffer转成对应的字符串。使用者通过调用stringDecoder.write(buffer)，可以获得buffer对应的字符串。
 *
 @module string_decoder
 */
var StringDecoder = require('string_decoder').StringDecoder

//模块接口 暴露StringStream 和 AlignedStringDecoder
module.exports = StringStream
module.exports.AlignedStringDecoder = AlignedStringDecoder

/**
 *
 功能：将流解码为字符串
 *
 @param {string} from, to 输入编码类型,输出编码类型
 *
 @return { string} 返回 输出编码类型 的字符串
 */

//this 客户端为 `window`, 服务端(node) 中为 `exports`
function StringStream(from, to) {
  if (!(this instanceof StringStream)) return new StringStream(from, to)

  //调用stream中的方法 (stream的继承)
  Stream.call(this)

  //若form为null，设置from为 utf-8 
  //第一个参数为空，默认为utf-8
  if (from == null) from = 'utf8'
  
  //可读 可写
  this.readable = this.writable = true 
  this.paused = false
  //参数to为空，this.toEncoding = from  不为空this.toEncoding=to
  this.toEncoding = (to == null ? from : to) 
  //参数to为空，this.fromEncoding = ''  不为空fromEncoding=from
  //实际运用中 传入两个参数时，第一个为输入数据格式，第二个为输出格式；
  //传入参数时只传入一个实参，则表示转换为该编码格式(toEncoding) 
  this.fromEncoding = (to == null ? '' : from)
  //实例化一个AlignedStringDecoder
  this.decoder = new AlignedStringDecoder(this.toEncoding)
}

//util.inherits  一个实现对象间原型继承 的函数
//从一个构造函数中继承原型方法到另一个
//util.inherits(constructor, superConstructor)
//constructor 的原型会被设置到一个从 superConstructor 创建的新对象上。
//SringStream 继承自stream
util.inherits(StringStream, Stream)

//////////////////////////////
//为StringStream添加write方法 
StringStream.prototype.write = function(data) {
  
  
  if (!this.writable) {
    //new Error 新建一个 Error 实例，并设置 error.message 属性以提供文本信息。 不可写时输出'stream not writable'
    //error.code 属性是标识错误类别的字符标签。 
    //触发'error'事件 传入err参数
    var err = new Error('stream not writable')
    err.code = 'EPIPE'
    this.emit('error', err)
    return false
  }
  
  
  if (this.fromEncoding) {
     //Buffer.isBuffer(data)  如果 data 是一个 Buffer 则返回 true ，否则返回 false 。
     //data 是一个 Buffer，  解码 data 成字符串。data = data.toString()
    if (Buffer.isBuffer(data))
    data = new Buffer(data, this.fromEncoding)//new Buffer(要编码的字符串,string 的字符串编码)  将data编码为fromEncoding
                                             //new Buffer(string[, encoding])是废弃的  新的--Buffer.from(string[, encoding])
  }
  //this.decoder = new (this.toEncoding)
  //this.decoder.write()见下面  
  //AlignedStringDecoder继承自StringDecoder，调用StringDecoder的方法   
  //AlignedStringDecoder.write([buffer])返回一个解码后的字符串，buffer :包含待解码字节的 Buffer。
  var string = this.decoder.write(data)
  //string有值，将string作为参数 触发data事件
  if (string.length) this.emit('data', string)
  return !this.paused
}

//向StringStream原型 添加flush方法
StringStream.prototype.flush = function() {
  if (this.decoder.flush) {
    var string = this.decoder.flush()
    if (string.length) this.emit('data', string)
  }
}

///////////////////////////////
//为StringStream添加end方法
StringStream.prototype.end = function() {
  //如果既不可读又不可写
  if (!this.writable && !this.readable) return
  this.flush()
  this.emit('end')
  this.writable = this.readable = false
  this.destroy()
}
//添加destroy方法
StringStream.prototype.destroy = function() {
  this.decoder = null
  this.writable = this.readable = false
  this.emit('close')
}

//添加pause方法
StringStream.prototype.pause = function() {
  this.paused = true
}
//添加resume方法
StringStream.prototype.resume = function () {
  //flowing 模式的流停止触发'data'事件时，触发'drain'事件
  //
  if (this.paused) this.emit('drain')
  this.paused = false
}

//////////////////////////////////////////////////////////
//定义 AlignedStringDecoder
//功能：base64编码 通过对齐每个发出的数据块来正确处理输出
function AlignedStringDecoder(encoding) {
  //继承自StringDecoder，调用StringDecoder的方法   
  //StringDecoder.write([buffer])返回一个解码后的字符串，buffer :包含待解码字节的 Buffer。
  StringDecoder.call(this, encoding)

  switch (this.encoding) {
    case 'base64': //this.encoding = base64
      this.write = alignedWrite
      this.alignedBuffer = new Buffer(3)
      this.alignedBytes = 0
      break
  }
}
//AlignedStringDecoder 继承自 StringDecoder
util.inherits(AlignedStringDecoder, StringDecoder)

//为AlignedStringDecoder添加flush方法
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
