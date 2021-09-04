// Objet db pour stocker la BDD ouverte
let db;
let messages=[];
let msgtosend=[];
let exists=false;
yeto="";

//alert
let encore = false;
let firt =true;
let autor = "123456789@$#123456789";
function froom(url) {
  return url.substr(3,8);
}

window.onload = function() {
	// Ouvrir la BDD; elle sera créée si elle n'existe pas déjà
	// (voir onupgradeneeded)
	let request = window.indexedDB.open('chatdb', 1);

	// la base de données n'a pas pu être ouverte avec succès
	request.onerror = function() {
  		console.log('Database failed to open');
	};

	// la base de données a été ouverte avec succès
	request.onsuccess = function() {
  		console.log('Database opened successfully');

  		// Stocke la base de données ouverte dans la variable db. On l'utilise par la suite
  		db = request.result;

  	    get(froom(location.pathname));
	};

	// Spécifie les tables de la BDD si ce n'est pas déjà pas fait
	request.onupgradeneeded = function(e) {
  	// Récupère une référence à la BDD ouverte
	  	let db = e.target.result;

	  	// Crée un objectStore pour stocker nos notes (une table)
	  	// Avec un champ qui s'auto-incrémente comme clé
	  	let objectStore = db.createObjectStore('roommessages', { keyPath: 'room', });

	  	// Définit les champs que l'objectStore contient
	  	objectStore.createIndex('room', 'room', { unique: false });
	  	objectStore.createIndex('msg', 'msg', { unique: false });
	  	objectStore.createIndex('msgts', 'msgts', { unique: false });

  		console.log('Database setup complete');
	};
};

function save(room, messages,tosend){
	// ouvrir une transaction en lecture/écriture
  let transaction = db.transaction(['roommessages'], 'readwrite');

  // récupérer l'object store de la base de données qui a été ouvert avec la transaction
  let objectStore = transaction.objectStore('roommessages');
////alert("saved")
  // demander l'ajout de notre nouvel objet à l'object store
  var request = objectStore.add({room : room,msg : messages, msgts : tosend});
  request.onsuccess = function() {
    //

  };

  // attendre la fin de la transaction, quand l'ajout a été effectué
  transaction.oncomplete = function() {
    console.log('Transaction completed: database modification finished.');

    
  };

  transaction.onerror = function() {
    console.log('Transaction not opened due to error');
  };

}
window.addEventListener("pagehide", function(event) { 
	save(froom(location.pathname), messages,msgtosend);
	//alert("quit")
});


function get(room) {
	// Ouvre l'object store puis récupère un curseur - qui va nous permettre d'itérer
  // sur les entrées de l'object store
   let objectStore = db.transaction('roommessages').objectStore('roommessages');
   let request = objectStore.get(room);

   request.onsuccess = function() {
   	
    if(request.result){

    	messages = request.result.msg;
    	msgtosend = request.result.msgts;
    	yeto=messages.length;
    	
       for (var i =  0 ; i<= messages.length - 1;  i++) {
       		var incomingMessage=messages[i];
       
    	   	  if(incomingMessage.id == autor){
	  	       encore = true;
			  }
			  else{
			  	autor = incomingMessage.id;
			  	encore = false;
			  }

			  if(firt){
			  	changebg('');
			  	const deft = document.getElementById("deft");
			  	deft.remove();
			  	firt=false;
			  }
			  if(incomingMessage.id==user.value){
			  	showMessage(incomingMessage,"me");
			  }
			  else{
			  	showMessage(incomingMessage,"lui");
			  }
			

		     
    }

    scroller();


   }
  }; 
}

function ifexists(room) {
	// Ouvre l'object store puis récupère un curseur - qui va nous permettre d'itérer
  // sur les entrées de l'object store
   let objectStore = db.transaction('chatdb').objectStore('roommessages');
   let request = objectStore.get(room);

   request.onsuccess = function() {
    if(request.result){
    	exists=true;
    }
    else{
    	exists=false;
    }
  }; 
}

function deletemsg(room) {
	// Ouvre l'object store puis récupère un curseur - qui va nous permettre d'itérer
  // sur les entrées de l'object store
   let objectStore = db.transaction('chatdb').objectStore('roommessages');
   let request = objectStore.delete(room);

   transaction.oncomplete = function() {
   	//
   }
}

