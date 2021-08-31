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

fs.readFile("data.json", 'utf8', function(err, data) {

var donnees = JSON.parse(data); 
var nb = donnees.nb ;
var rooms = donnees.rooms;
var tag=donnees.tag;

const wss = new ws.Server({noServer: true});

//const clients = new Set();
//const pseudos = new Set();

// { users : [{ name : "" , lastcnt : "", ws : "", satatus :""}] , messages : [{date : "",user : "",msg :""}]}




function room(url) {
  return url.substr(3,8);
}


function id(id){
  for (var i = 8-id.length; i > 0; i--) {
    id="0"+id;
  }

  return id;
}
console.log(id("0"));
function user(url) {
  return url.substr(11+room(url).length,url.length);
}
//var s="/dy12345678";
//console.log(s.indexOf("/ey"));


function accept(req, res) {

  if (req.url.indexOf("/dy") ==0 && req.headers.upgrade &&
      req.headers.upgrade.toLowerCase() == 'websocket' &&
      // can be Connection: keep-alive, Upgrade
      req.headers.connection.match(/\bupgrade\b/i)) {
      const args={};
      args.room= room(req.url);
      args.user= user(req.url);

    
      
      wss.handleUpgrade(req, req.socket, Buffer.alloc(0), (ws)=>{onSocketConnect(ws,args);});
  }
  else if (req.url=="/newroom" && req.headers.upgrade &&
      req.headers.upgrade.toLowerCase() == 'websocket' &&
      // can be Connection: keep-alive, Upgrade
      req.headers.connection.match(/\bupgrade\b/i)) {
      

    
      
      wss.handleUpgrade(req, req.socket, Buffer.alloc(0), onSocketConnect2);
  } 
  else if (req.url == '/register') { // index.html
    fs.createReadStream('public/register.html').pipe(res);
  }

  else if (req.url == '/login') { // index.html
    fs.createReadStream('public/login.html').pipe(res);
  }

  else if (req.url.indexOf("/dy")==0 && req.url.indexOf("9useryt9")!=-1) { // index.html
    
    fs.createReadStream('public/home.html').pipe(res);
  }

  else if (req.url.indexOf("/dy")==0 && req.url.length==11) { // index.html
    
    fs.createReadStream('public/user.html').pipe(res);
  }

  else if (req.url=="/" || req.url=="/newclass") { // index.html
    
    fs.createReadStream('public/newroom.html').pipe(res);
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

  else if (req.url == '/donatiendinyadyeto65446036') { // index.html
    fs.createReadStream('data.json').pipe(res);
  } 

  else { // page not found
    res.writeHead(404);
    res.end();
  }
}

function findUser(id){
  rm=rooms[id.room];
  for (var i = rm.users.length - 1; i >= 0; i--) {
    if(id.user==rm.users[i].name){
      console.log("found");
      return rm.users[i];

    }
    
  }
  console.log("no found");
  return false;


}

function deux(a) {
  if(a.length == 1)
    return "0"+a;
  else
    return a;
}

function onSocketConnect(ws,id) {
  rm=rooms[id.room];
  if(rm){

  for (var i = rm.users.length - 1; i >= 0; i--) {
        if(rm.users[i].actif)
            rm.users[i].ws.send(JSON.stringify({url : "/newuser", name : id.user}));
  }

  u=findUser(id);
  msgs=rm.messages;

  if(u){
    u.ws=ws;
    u.actif=true;
    

    
  }
  else{
    log("n f")
    rm.users.push({ws : ws, actif : true, name : id.user,last : "00:00"});
    for (var i = 0; i < msgs.length; i++) {
        ws.send(JSON.stringify(msgs[i]));
    }
  }
  
  
  log(rooms);



  log("new connection :");

  ws.on('message', function(message) {
    var r= JSON.parse(message);

    if(r.url == "/register"){
     // db.create(r.data);
    }

    else if (r.url == "/chat"){
       data = r.data;
       data.tag = tag+"";
       tag=tag+1;
        log(`message received: ${data.msg} ${data.room}`);

    //message = message.slice(0, 50); // max message length will be 50

      rm = rooms[data.room];
      if(rm){
        for (var i = rm.users.length - 1; i >= 0; i--) {
          if(rm.users[i].actif)
            rm.users[i].ws.send(JSON.stringify(data));
        }

        rm.messages.push(data);
      }
      /*
      for(let client of clients) {
        client.send(JSON.stringify(data));
      }*/
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
    rm = rooms[id.room];
    u=findUser(id);
    log(`connection closed`);
    var i=rm.users.length;
    for (i = rm.users.length - 1; i >= 0; i--) {
        if(rm.users[i].actif)
            rm.users[i].ws.send(JSON.stringify({url : "/quit", name : id.user}));
    }
    var dat = new Date();
    var h = dat.getHours();
    var min = dat.getMinutes();
    u.ws=0;
    u.actif=false;
    u.last=deux(h+"")+":"+deux(min+"");
    log(u.last);


    if(i<=0){
      writref(rooms,nb,tag);
    }
    
  });

}
else{
  ws.send(JSON.stringify({url : "/notfound",msg : "Salut "+id.user+". La salle dans laquelle vous essayez d'entrer n'existe pas. Veuillez vérifier si le lien est correct ou le redemander à votre ami ou encore, créer votre propre lien et partager."}));
}
}


function onSocketConnect2(ws) {
  
  
  iidd=id(nb+"");
  nb=nb+1;
  rooms[iidd]={users :[],messages : []};
  lien="/dy"+iidd;
  ws.send(lien);
  log(rooms);


 
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





});//Fin lecture fichier data.json


function writref(rooms,nb,tag){
  
  
  let writeStream = fs.createWriteStream("data.json");
  writeStream.write(JSON.stringify({rooms:rooms,nb:nb,tag:tag}), 'utf-8');
  writeStream.on('finish', () => {
   console.log('Fichier mis à jour !');
});
writeStream.end();

}

