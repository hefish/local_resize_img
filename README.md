Local Resize Image

1、把input type=file的提交，改成提交base64编码 (服务器端相应base64_decode)
2、本地压缩图片，根据exif旋转
3、安卓调用JPEGEncoder，生成jpg数据
4、iOS调用megapix-image，修复ios6/7的图片拉伸问题


具体应用参见index.html源码
