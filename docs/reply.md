# streamstring代码解读展示
## 一、成果仓库
https://github.com/guwenjia/nodejs-Code-interpretation
## 二、项目分析
### 1.项目类型：第三方库
### 2.项目功能
将流解码为字符串
使其通过不同的编码类型输出
### 3.项目文件及依赖项：
streamstring.js  为项目的入口文件，其中暴露的函数作为第三方模块引用

README.md  对项目作描述和说明

example.js 项目功能实例

LICENSE  文件统一用的MIT共享协议

package.json  存储工程的元数据，描述项目的依赖项，类似配置文件。

.travis.yml  travis-ci持续集成工具的配置文件

没有测试脚本  没有使用自动化测试
### 4.项目功能展示：
eg:
先来看一下Myfile文件的内容：hi how are ?
![ex1](https://github.com/guwenjia/nodejs-Code-interpretation/blob/master/docs/images/myfile.png)

案例一：读取Myfile文件，将其转换为hex编码格式输出
![ex1](https://github.com/guwenjia/nodejs-Code-interpretation/blob/master/docs/images/ex1.png)

案例二：读取Myfile文件，将其转换为hex，再转换为base64编码格式输出
![ex2](https://github.com/guwenjia/nodejs-Code-interpretation/blob/master/docs/images/ex2.png)

案例三：读取Myfile文件，将其转换为base64编码格式输出
![ex3](https://github.com/guwenjia/nodejs-Code-interpretation/blob/master/docs/images/ex3.1.png)
> Base64编码说明    
> Base64编码要求把3个8位字节（3*8=24）转化为4个6位的字节（4*6=24），之后在6位的前面补两个0，形成8位一个字节的形式。 如果剩下的字符不足3个字节，则用0填充，输出字符使用'='，因此编码后输出的文本末尾可能会出现1或2个'='。

![ex3.1](https://github.com/guwenjia/nodejs-Code-interpretation/blob/master/docs/images/ex3.png)

#### 5.项目代码分析
1. 代码模块中有哪些函数？各个函数都是做什么的？

streamstring() 将流转换成字符串
AlignedStringDecoder()  将buffer对齐输出为字符串

2. 代码中是否有可以改进的地方？

有些API是旧的，如new Buffer(string[, encoding])是废弃的  新的--Buffer.from(string[, encoding])
添加测试脚本

3.代码的可读性如何？结构清晰吗？编码风格如何？

代码可读性高;

整体结构清晰；

通过添加不同方法实现不同功能；

#### 6.项目文档分析
1. README.md文档 
2. stringstream.js文件

    数据结构：数值、字符串型
3. 所需模块：

+ var util = require('util')
+ var Stream = require('stream')
+ var StringDecoder = require('string_decoder').StringDecoder
