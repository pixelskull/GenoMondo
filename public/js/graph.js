// Access Canvas
var canvas = new fabric.Canvas('c');
// Global counter for IDs
var idCounter = 1;

// Sammlung aller PersonElemente
var personen = [];

// Graphische Repräsentation einer Person
var PersonElement = function(id) {
var self = this;
// Zu Personensammlung hinzufŸgen
personen[personen.length] = self;

// Image (Beispiel)
self.image = new fabric.Image();
self.image.setLeft(50).setTop(50);
self.connections = [];
// Id
if (id) {
	self.id = id;
} else {
	self.id = idCounter++; //TODO update counter for all clients
}

// Initialize Person
fabric.Image.fromURL('http://placekitten.com/g/300/300', function(oImg) {
	oImg.scaleToWidth(100).scaleToHeight(100);
	oImg.setLeft(50);
	oImg.setTop(50);

	canvas.add(oImg);
	self.image = oImg;
    self.propagateMove();
	
	// EventListener for moving
	oImg.on('moving', function(options) {
        updatePersonPosition(self.id, {'x': self.getLeft(), 'y': self.getTop()});
		self.propagateMove();
		moved = true;
	});
});


self.propagateMove = function() {
	self.image.setCoords();
	for (var i = 0; i < self.connections.length; i++) {
		self.connections[i].updateHandles();
	}
}

self.addConnection = function(connection) {
	// †berprŸfen ob connection schon enthalten ist
	for (var i = 0; i < self.connections.length; i++) {
		if (self.connections[i] == connection) {
			return false;
		}
	}
	// Add Connection otherwise
	self.connections[self.connections.length] = connection;
	return true;
}

self.removeConnection = function(connection) {
	var index = self.connections.indexOf(connection);
	if (index > -1) {
		self.connections.splice(index, 1);
	}
}

// Getter und Setter für Position und Größe
self.getLeft = function() {
	return self.image.getLeft();
}

self.setLeft = function(left) {
	self.image.setLeft(left);
	return self; 
}; 

self.getTop = function() {
	return self.image.getTop();
}

self.setTop = function(top) {
	self.image.setTop(top);
	return self; 
}

self.getWidth = function() {
	return self.image.getWidth();
}

self.getHeight = function() {
	return self.image.getHeight();
}

// this.person = person;
return this;
};

// Connection für Beziehungen zweier Personen (Start Person ist immer gegeben, Zielperson steht zu Beginn noch nicht fest)
Connection = function(startPerson, endPerson) {
var self = this;
self.id = idCounter++;
this.startPerson = startPerson;
this.endPerson = endPerson;

self.setId = function(id) {
	self.id = id;
}

// Circle on Person
self.circleFrom = new fabric.Circle({
  radius: 20, fill: 'blue', left: startPerson.getLeft() + startPerson.getWidth() - 20, top: startPerson.getTop() - 20
});
self.circleFrom.on('moving', function() {
	self.updateLine()
	moved = true;
});
self.circleFrom.on('modified', function() {
	// Über Person?
	var freeCircle = true;
	canvas.forEachObject(function(obj) {
      if (obj === self.circleFrom) return;
	  if (obj.get('type') == 'image' 
			&& obj.containsPoint(self.circleFrom.getCenterPoint())) {
			freeCircle = false;
		// find PersonElement
		for (var i = 0; i < personen.length; i++) {
			if (personen[i].image == obj) {
				self.setStartPerson(personen[i]);
				
				// update remote connections
				updateRelation(self.id, 'from', personen[i].id);
			}
		}
	  }
    });
	// freeCircle? 
	if (freeCircle) {
		self.setStartPerson(undefined);
		
		// update remote connections
		updateRelation(self.id, 'from');
	}
});

// Second Circle 
self.circleTo = new fabric.Circle({
  radius: 20, fill: 'blue', left: self.circleFrom.getLeft() + 40, top: self.circleFrom.getTop()
});
self.circleTo.on('moving', function() {
	self.updateLine()
	moved = true;
});
self.circleTo.on('modified', function() {
	// Handle über Person?
	var freeCircle = true;
	canvas.forEachObject(function(obj) {
      if (obj === self.circleTo) return;
	  if (obj.get('type') == 'image' 
			&& obj.containsPoint(self.circleTo.getCenterPoint())) {
			freeCircle = false;
		// find PersonElement
		for (var i = 0; i < personen.length; i++) {
			if (personen[i].image == obj) {
				self.setEndPerson(personen[i]);
				
				// update remote connections
				updateRelation(self.id, 'to', personen[i].id);
			}
		}
	  }
    });
	// freeCircle? 
	if (freeCircle) {
		self.setEndPerson(undefined);
		
		// update remote connections
		updateRelation(self.id, 'to');
	}
});

self.setStartPerson = function(person) {
	// reset StartPerson?
	if (person) {
		// try to add connection to new endPerson
		if (person.addConnection(self)) {
			// Remove connection from old endPerson
			if (self.startPerson) {
				self.startPerson.removeConnection(self);
			}
			self.startPerson = person;
			self.updateHandles();
		} else {
			alert("Verbindungen mit sich selbst werden noch nicht unterstützt");
		}
	} else {
		// and valid connection?
		if (self.endPerson) {
			// Remove connection from old endPerson
			if (self.startPerson) {
				self.startPerson.removeConnection(self);
			}
			self.startPerson = undefined;
			self.updateHandles();
		} else {
			// not valid connection
			alert("Verbindungen müssen immer zu mindestens einer Person gehören")
			self.updateHandles();
		}
	}
}

self.setEndPerson = function(person) {
	// reset EndPerson?
	if (person) {
		// try to add connection to new endPerson
		if (person.addConnection(self)) {
			// Remove connection from old endPerson
			if (self.endPerson) {
				self.endPerson.removeConnection(self);
			}
			self.endPerson = person;
			self.updateHandles();
		} else {
			alert("Verbindungen mit sich selbst werden noch nicht unterstützt");
		}
	} else {
		// and valid connection?
		if (self.startPerson) {
			// Remove connection from old endPerson
			if (self.endPerson) {
				self.endPerson.removeConnection(self);
			}
			self.endPerson = undefined;
			self.updateHandles();
		} else {
			// not valid connection
			alert("Verbindungen müssen immer zu mindestens einer Person gehören")
			self.updateHandles();
		}
	}
}

// Line between Circles
self.line = new fabric.Line([self.circleFrom.getLeft() + self.circleFrom.getRadiusX(), self.circleFrom.getTop() + self.circleFrom.getRadiusY(), self.circleTo.getLeft() + self.circleTo.getRadiusX(), self.circleTo.getTop() + self.circleTo.getRadiusY()], {
      fill: 'blue',
      stroke: 'blue',
      strokeWidth: 2,
      selectable: false
    });

// Add all to Canvas
canvas.add(self.line);
canvas.add(self.circleFrom);
canvas.add(self.circleTo);

// Update Connection after/during move of person
this.updateHandles = function() {
	// pMoving gibt es immer, pUnmoving gibt es nur bei einer vollständigen Connection zwischen zwei Personen
	// CircleMoving bewegt sich mit pMoving
	// CircleUnmoving bewegt sich nicht bzw. kaum, ggf. auf der anderen Person
	var pMoving;
	var cMoving;
	var pUnmoving;
	var cUnmoving;
	if (self.startPerson) {
		cMoving = self.circleFrom;
		cUnmoving = self.circleTo;
		pMoving = self.startPerson
		pUnmoving = self.endPerson;
	} else {
		cMoving = self.circleTo;
		cUnmoving = self.circleFrom;
		pMoving = self.endPerson;
		pUnmoving = self.startPerson;
	}
	
	// Gibt es zwei Personen?
	if (pUnmoving) {
		// Connection nach rechts, links, oben oder unten?
		if (pMoving.getTop() + pMoving.getHeight() < pUnmoving.getTop()) {
			// Unten an pMoving
			cMoving.setLeft(pMoving.getLeft() + pMoving.getWidth()/2 - cMoving.getRadiusX());
			cMoving.setTop(pMoving.getTop() + pMoving.getHeight() - cMoving.getRadiusY());
			// Oben an pUnmoving
			cUnmoving.setLeft(pUnmoving.getLeft() + pUnmoving.getWidth()/2 - cUnmoving.getRadiusX());
			cUnmoving.setTop(pUnmoving.getTop() - cUnmoving.getRadiusY());	
		} else if (pMoving.getTop() > pUnmoving.getTop() + pUnmoving.getHeight()) {
			// Oben an pMoving
			cMoving.setLeft(pMoving.getLeft() + pMoving.getWidth()/2 - cMoving.getRadiusX());
			cMoving.setTop(pMoving.getTop() - cMoving.getRadiusY());
			// Unten an pUnmoving
			cUnmoving.setLeft(pUnmoving.getLeft() + pUnmoving.getWidth()/2 - cUnmoving.getRadiusX());
			cUnmoving.setTop(pUnmoving.getTop() + pUnmoving.getHeight() - cUnmoving.getRadiusY());
		} else {
			// Seitlich an pMoving
			if (pMoving.getLeft() < pUnmoving.getLeft()) {
				// Rechts an pMoving
				cMoving.setLeft(pMoving.getLeft() + pMoving.getWidth() - cMoving.getRadiusX());
				cMoving.setTop(pMoving.getTop() + pMoving.getHeight()/2 - cMoving.getRadiusY());
				// Links an pMoving
				cUnmoving.setLeft(pUnmoving.getLeft() - cUnmoving.getRadiusX());
				cUnmoving.setTop(pUnmoving.getTop() + pUnmoving.getHeight()/2 - cUnmoving.getRadiusY());
			} else {
				// Links an pMoving
				cMoving.setLeft(pMoving.getLeft() - cMoving.getRadiusX());
				cMoving.setTop(pMoving.getTop() + pMoving.getHeight()/2 - cMoving.getRadiusY());
				// Rechts an pMoving
				cUnmoving.setLeft(pUnmoving.getLeft() + pUnmoving.getWidth() - cUnmoving.getRadiusX());
				cUnmoving.setTop(pUnmoving.getTop() + pUnmoving.getHeight()/2 - cUnmoving.getRadiusY());
			}
		}
	} else {
	// Wenn die andere Seite der Connection frei ist, bewege sie mit
		cMoving.setLeft(pMoving.getLeft() + pMoving.getWidth() - cMoving.getRadiusX());
		cMoving.setTop(pMoving.getTop() - cMoving.getRadiusY());
		cUnmoving.setLeft(cMoving.getLeft() + 40);
		cUnmoving.setTop(cMoving.getTop());
	}
	cMoving.setCoords();
	cUnmoving.setCoords();
	this.updateLine();
}

this.updateLine = function() {
	self.line.set('x1', self.circleFrom.getLeft() + self.circleFrom.getRadiusX());
	self.line.set('y1', self.circleFrom.getTop() + self.circleFrom.getRadiusY());
	self.line.set('x2', self.circleTo.getLeft() + self.circleTo.getRadiusX());
	self.line.set('y2', self.circleTo.getTop() + self.circleTo.getRadiusY());
	self.line.setCoords();
	canvas.renderAll();
}

// um die Darstellung zu korrigieren wenn eine Connection mit beiden Personen gleichzeitig erstellt wurde
self.updateHandles();

};

var addPerson = function(id) {
	var person = new PersonElement(id);
	elementMap[person.id] = person;
	return person;
}

var addConnection = function(p1, p2) {
	var connection = new Connection(p1, p2);
	if (!p1) {
		alert("Eine Verbindung muss immer zu mindestens einer Person gehšren");
	} else {
		p1.addConnection(connection);
	}
	if (p2) {
		p2.addConnection(connection);
	}
	if (connection && !elementMap[connection.id]) {
		elementMap[connection.id] = connection;
	}
	return connection;
}

var addConnectionWithId = function(id, p1, p2) {
	var con = addConnection(p1, p2);
	con.setId(id);
	return con;
}

var removePerson = function(person) {
	// Remove all free Connections and Persons from not free connections
	// temp save for free connections (otherwise loop is disrupted by changing array during iteration)
	var freeCons = [];
	for (var i = 0; i < person.connections.length; i++) {
		var con = person.connections[i];
		// free connections?
		if (con.startPerson == person) {
			if (!con.endPerson) {
				freeCons[freeCons.length] = con;
			} else {
				con.startPerson = undefined;
				con.updateHandles();
			}
		} else {
			if (!con.startPerson) {
				freeCons[freeCons.length] = con;
			} else {
				con.endPerson = undefined;
				con.updateHandles();
			}
		}
	}
	// Remove freeCons
	for (var i = 0; i < freeCons.length; i++) {
		removeConnection(freeCons[i]);
	}
	
	// Remove PersonElement
	// from list
	var index = personen.indexOf(person);
	if (index > -1) {
		personen.splice(index, 1);
	}
	// from canvas
	canvas.remove(person.image);
}

var removeConnection = function(connection) {
	// Remove con from both persons
	if (connection.startPerson) {
		connection.startPerson.removeConnection(connection);
	}
	if (connection.endPerson) {
		connection.endPerson.removeConnection(connection);
	}
	
	// Remove visual elements from canvas
	canvas.remove(connection.line);
	canvas.remove(connection.circleFrom);
	canvas.remove(connection.circleTo);
}





// Eventlistener to open/close Menu
var menu = new Menu();
// Canvas does not support doubleclick Event!
document.addEventListener('dblclick', function(e) { menu.menu({'x': e.clientX, 'y': e.clientY}); });
		
// Event mouse:up only if not at the end of move
var moved = false;
canvas.on('mouse:up', function(options) {
	if (moved) {
		moved = false;
	} else {
		if (options.target && options.target.type == 'image') {
			// search for person to open menu on
			for (var i = 0; i < personen.length; i++) {
				if (personen[i].image == options.target) {
					menu.menu({'x': options.e.clientX, 'y': options.e.clientY}, 'image', personen[i]);
					return;
				}
			}
		} else if (options.target && (options.target.type == 'circle' || options.target.type == 'line')) {
			// search for connection to open menu on
			for (var i = 0; i < personen.length; i++) {
				for (var j = 0; j < personen[i].connections.length; j++) {
					var con = personen[i].connections[j];
					if (con.circleFrom == options.target || con.circleTo == options.target || con.line == options.target) {
						menu.menu({'x': options.e.clientX, 'y': options.e.clientY}, 'line', con);
						return;
					}
				}
			}
		}
		// sonst ignorieren
	}
});
