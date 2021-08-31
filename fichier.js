const fs = require('fs');
fs.writeFile('rooms.json', '{"nom" : "yeto","p":"Donatien"}', function (err) {
   if (err) throw err;
   console.log('Fichier créé !');
});

var rooms={};

async function  read(file) {
fs.readFile(file, 'utf8', function(err, data) {
   return  data; 
 });

}

var content = await read("rooms.json");

rooms = JSON.parse(content);
console.log(rooms.nom);
console.log(rooms);

