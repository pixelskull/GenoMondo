// Access Canvas
var canvas = new fabric.Canvas('c');

// Sammlung aller PersonElemente
var personen = [];

// Graphische Repräsentation einer Person
PersonElement = function() {
var self = this;
// Zu Personensammlung hinzufügen
personen[personen.length] = self;

// Image (Beispiel)
self.image;
self.connections = [];

// Initialize Person
fabric.Image.fromURL('http://placekitten.com/g/300/300', function(oImg) {
  oImg.scaleToWidth(100).scaleToHeight(100);
  oImg.setLeft(50).setTop(50);
  // EventListener for moving
  oImg.on('moving', function(options) {
	propagateMove();
  });
  canvas.add(oImg);
  self.image = oImg;
  // Handle für Connections
  self.connections[self.connections.length] = new Connection(self);
});

var propagateMove = function() {
	for (var i = 0; i < self.connections.length; i++) {
		self.connections[i].updateHandles(self);
	}
}

self.addConnection = function(connection) {
	// Überprüfen of connection schon enthalten ist
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

self.getTop = function() {
	return self.image.getTop();
}

self.getWidth = function() {
	return self.image.getWidth();
}

self.getHeight = function() {
	return self.image.getHeight();
}

return this;
};

// Connection für Beziehungen zweier Personen (Start Person ist immer gegeben, Zielperson steht zu Beginn noch nicht fest)
Connection = function(startPerson) {
var self = this;
this.startPerson = startPerson;
this.endPerson;

// Circle on Person
var circleFrom = new fabric.Circle({
  radius: 20, fill: 'blue', left: startPerson.getLeft() + startPerson.getWidth() - 20, top: startPerson.getTop() - 20
});
circleFrom.on('moving', function() {
	self.updateLine()
});
circleFrom.on('modified', function() {
	// Über Person?
	canvas.forEachObject(function(obj) {
      if (obj === circleFrom) return;
	  if (obj.get('type') == 'image' 
			&& obj.containsPoint(circleFrom.getCenterPoint())) {
		// find PersonElement
		for (var i = 0; i < personen.length; i++) {
			if (personen[i].image == obj) {
				// try to add connection to new startPerson
				if (personen[i].addConnection(self)) {
					 // Remove connection from old startPerson
					self.startPerson.removeConnection(self);
					// set new startPerson for connection
					self.startPerson = personen[i];
					// update visualization
					self.updateHandles(self.startPerson);
				} else {
					alert("Verbindungen mit sich selbst werden noch nicht unterstützt");
				}
			}
		}
	  }
    });
});
// Free Circle 
var circleTo = new fabric.Circle({
  radius: 20, fill: 'white', left: circleFrom.getLeft() + 40, top: circleFrom.getTop()
});
circleTo.on('moving', function() {
	self.updateLine()
});
circleTo.on('modified', function() {
	// Über Person?
	canvas.forEachObject(function(obj) {
      if (obj === circleTo) return;
	  if (obj.get('type') == 'image' 
			&& obj.containsPoint(circleTo.getCenterPoint())) {
		// find PersonElement
		for (var i = 0; i < personen.length; i++) {
			if (personen[i].image == obj) {
				// try to add connection to new endPerson
				if (personen[i].addConnection(self)) {
					// Remove connection from old endPerson
					if (self.endPerson) {
						self.endPerson.removeConnection(self);
					}
					self.endPerson = personen[i];
					self.updateHandles(self.endPerson);
				} else {
					alert("Verbindungen mit sich selbst werden noch nicht unterstützt");
				}
			}
		}
	  }
    });
});
// Line between Circles
var line = new fabric.Line([circleFrom.getLeft() + circleFrom.getRadiusX(), circleFrom.getTop() + circleFrom.getRadiusY(), circleTo.getLeft() + circleTo.getRadiusX(), circleTo.getTop() + circleTo.getRadiusY()], {
      fill: 'blue',
      stroke: 'blue',
      strokeWidth: 2,
      selectable: false
    });

// Add all to Canvas
canvas.add(line);
canvas.add(circleFrom);
canvas.add(circleTo);

// Update Connection after/during move of person
this.updateHandles = function(person) {
	// CircleMoving bewegt sich mit der übergebenen Person (pMoving)
	// CircleUnmoving bewegt sich nicht bzw. kaum, ggf. auf der anderen Person (pUnmoving)
	var pMoving = person;
	var cMoving;
	var pUnmoving;
	var cUnmoving;
	if (person == this.startPerson) {
		cMoving = circleFrom;
		cUnmoving = circleTo;
		pUnmoving = this.endPerson;
	} else {
		cMoving = circleTo;
		cUnmoving = circleFrom;
		pUnmoving = this.startPerson;
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
	line.set('x1', circleFrom.getLeft() + circleFrom.getRadiusX());
	line.set('y1', circleFrom.getTop() + circleFrom.getRadiusY());
	line.set('x2', circleTo.getLeft() + circleTo.getRadiusX());
	line.set('y2', circleTo.getTop() + circleTo.getRadiusY());
	line.setCoords();
	canvas.renderAll();
}

};

var addAss = function() {
	var person = new PersonElement();
}




// Eventlistener to open/close Menu
var menu = new Menu();
// Canvas does not support doubleclick Event!
document.addEventListener('dblclick', function() { menu.menu();
		});
