## websocket 实现文件上传

#### 安装依赖

```
npm i
```

#### 运行

```
npm start
```

#### 项目说明

- websocket 只能发送字符串或原始对象
- 如果发送字符串，需要把 file 对象使用 FileReader 转换为 base64，但是这样会导致性能下降，因为文件变换为 base64 后，内容过长，不适合传输
- 这里采用的是，把 file 对象转换为 ArrayBuffer，由于直接发送这个 arraybuffer，会导致生成文件时，不知道文件的类型，因此，在上传时，使用 Uint8Array 进行了编辑，把扩展名和文件内容本身一起传给后端，后端再进行解析并生成文件
