/**
Before running:
> npm install ws
Then:
> node server.js
> open http://localhost:8080 in the browser
*/

const http = require('http');
const fs = require('fs');
const ws = new require('ws');
//const  db = require("db");

const wss = new ws.Server({noServer: true});

const clients = new Set();

function accept(req, res) {

  if (req.url == '/ws' && req.headers.upgrade &&
      req.headers.upgrade.toLowerCase() == 'websocket' &&
      // can be Connection: keep-alive, Upgrade
      req.headers.connection.match(/\bupgrade\b/i)) {
      wss.handleUpgrade(req, req.socket, Buffer.alloc(0), onSocketConnect);
  } 
  else if (req.url == '/register') { // index.html
    fs.createReadStream('public/register.html').pipe(res);
  }

  else if (req.url == '/login') { // index.html
    fs.createReadStream('public/login.html').pipe(res);
  }

  else if (req.url == '/home') { // index.html
    
    fs.createReadStream('public/home.html').pipe(res);
  } 

  else if (req.url == '/bootstrap.min.css') { // index.html
    fs.createReadStream('public/bootstrap.min.css').pipe(res);
  } 

  else if (req.url == '/bootstrap.bundle.min.js') { // index.html
    fs.createReadStream('public/bootstrap.bundle.min.js').pipe(res);
  }

  else if (req.url == '/aaa.png') { // index.html
    fs.createReadStream('public/img/aaa.png').pipe(res);
  } 

  else if (req.url == '/bbb.jpeg') { // index.html
    fs.createReadStream('public/img/bbb.jpeg').pipe(res);
  } 

  else if (req.url == '/disc.webp') { // index.html
    fs.createReadStream('public/img/disc.webp').pipe(res);
  } 

  else if (req.url == '/jquery.min.js') { // index.html
    fs.createReadStream('public/jquery.min.js').pipe(res);
  } 

  else { // page not found
    res.writeHead(404);
    res.end();
  }
}

function onSocketConnect(ws) {
  clients.add(ws);
  log(`new connection`);

  ws.on('message', function(message) {
    var r= JSON.parse(message);

    if(r.url == "/register"){
     // db.create(r.data);
    }

    else if (r.url == "/chat"){
       data = r.data;
        log(`message received: ${data.msg}`);

    //message = message.slice(0, 50); // max message length will be 50

      for(let client of clients) {
        client.send(JSON.stringify(data));
      }
    }

    /*else if (r.url == "/login"){
      if(db.login(r.data)){
        for(let client of clients) {
        client.send(JSON.stringify({status : "connecte"}));
      }
        
      }
      else{

        for(let client of clients) {
        client.send(JSON.stringify({status : "error"}));
      }
    }
      }*/
  });

  ws.on('close', function() {
    log(`connection closed`);
    clients.delete(ws);
  });
}

let log;
if (!module.parent) {
  log = console.log;
  http.createServer(accept).listen(process.env.PORT || 3000, process.env.YOUR_HOST || '0.0.0.0');;
} else {
  // to embed into javascript.info
  log = function() {};
  // log = console.log;
  exports.accept = accept;
}