const uuid = require('uuid');
const Websocket = require('ws');
const { parse } = require('url');
const { resolve } = require('path');
const { createServer } = require('http');
const { createReadStream, createWriteStream } = require('fs');
const port = 8080;

const server = createServer((req, res) => {
  const { pathname } = parse(req.url, true);
  if (pathname === '/') {
    res.setHeader('content-type', 'text/html');
    createReadStream(resolve(__dirname, 'index.html')).pipe(res);
  } else if (pathname === '/favicon.ico') {
    res.setHeader('content-type', 'image/x-icon');
    createReadStream(resolve(__dirname, 'favicon.ico')).pipe(res);
  } else {
    res.statusCode = 404;
    res.end('Not Found');
  }
}).listen(port);

const websocket = new Websocket.Server({ server });
websocket.on('connection', socket => {
  socket.on('message', res => {
    let msgType = typeof res;
    switch (msgType) {
      case 'string':
        let msg;
        try {
          msg = JSON.parse(res);
        } catch (error) {
          msg = res;
        }
        console.log(msg);
        break;
      case 'object':
        //buffer
        let filename = uuid.v1();
        //res的前4位是文件的扩展名
        let arr = [...res];
        let extnameArr = arr.splice(0, 4);
        if (extnameArr[2] === 0) {
          extnameArr = extnameArr.slice(0, 2);
        } else if (extnameArr[3] === 0) {
          extnameArr = extnameArr.slice(0, 3);
        }
        let extname = Buffer.from(extnameArr).toString();
        res = Buffer.from(arr);
        let ws = createWriteStream(resolve(`./upload/${filename}.${extname}`));
        ws.write(res);
        ws.end();
        ws.on('close', () => {
          socket.send('上传成功');
        });
        ws.on('error', err => {
          console.log(err);
        });
        ws.on('finish', () => {
          console.log('finish');
        });
        break;
      default:
        break;
    }
  });
  socket.on('close', () => {
    console.log('close');
  });
});
