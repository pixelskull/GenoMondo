Raphael.el.isVisible = function() {
  return this.node.style.display !== "none";
};

Raphael.fn.connection = function (obj1, obj2, line, bg) {
    if (obj1.line && obj1.from && obj1.to) {
        line = obj1;
        obj1 = line.from;
        obj2 = line.to;
    }
    var bb1 = obj1.getBBox(),
        bb2 = obj2.getBBox(),
        p = [{x: bb1.x + bb1.width / 2, y: bb1.y - 1},
        {x: bb1.x + bb1.width / 2, y: bb1.y + bb1.height + 1},
        {x: bb1.x - 1, y: bb1.y + bb1.height / 2},
        {x: bb1.x + bb1.width + 1, y: bb1.y + bb1.height / 2},
        {x: bb2.x + bb2.width / 2, y: bb2.y - 1},
        {x: bb2.x + bb2.width / 2, y: bb2.y + bb2.height + 1},
        {x: bb2.x - 1, y: bb2.y + bb2.height / 2},
        {x: bb2.x + bb2.width + 1, y: bb2.y + bb2.height / 2}],
        d = {}, dis = [],
        dx = 0,
        dy = 0;
    for (var i = 0; i < 4; i++) {
        for (var j = 4; j < 8; j++) {
            dx = Math.abs(p[i].x - p[j].x);
            dy = Math.abs(p[i].y - p[j].y);
            if ((i == j - 4) ||
               (((i != 3 && j != 6) ||
               p[i].x < p[j].x) &&
               ((i != 2 && j != 7) ||
               p[i].x > p[j].x) &&
               ((i !== 0 && j != 5) ||
               p[i].y > p[j].y) &&
               ((i != 1 && j != 4) ||
               p[i].y < p[j].y))) {
                dis.push(dx + dy);
                d[dis[dis.length - 1]] = [i, j];
            }
        }
    }
    var res;
    if (dis.length === 0) {
        res = [0, 4];
    } else {
        res = d[Math.min.apply(Math, dis)];
    }
    var x1 = p[res[0]].x,
        y1 = p[res[0]].y,
        x4 = p[res[1]].x,
        y4 = p[res[1]].y;
    dx = Math.max(Math.abs(x1 - x4) / 2, 10);
    dy = Math.max(Math.abs(y1 - y4) / 2, 10);
    var x2 = [x1, x1, x1 - dx, x1 + dx][res[0]].toFixed(3),
        y2 = [y1 - dy, y1 + dy, y1, y1][res[0]].toFixed(3),
        x3 = [0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx][res[1]].toFixed(3),
        y3 = [0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4][res[1]].toFixed(3);
    var path = ["M", x1.toFixed(3),
                y1.toFixed(3),
                "C", x2, y2, x3, y3,
                x4.toFixed(3),
                y4.toFixed(3)]
                .join(",");

    // mittelpunkt ausrechnen
    var xc = parseInt( (x4-x1)/2+x1 );
    var yc = parseInt( (y4-y1)/2+y1 );
    // EO mittelpunkt ausrechnen


    if (line && line.line) {
        line.bg && line.bg.attr({path: path});
        line.line.attr({path: path});

        // punk aktualisieren
        line.circle.attr({cx: xc ,cy: yc});
        // EO punk aktualisieren
    } else {
        var color = typeof line == "string" ? line : "#000";
        return {
            bg: bg && bg.split && this.path(path).attr({stroke: bg.split("|")[0],
                                                        fill: "none",
                                                        "stroke-width": bg.split("|")[1] || 3}),
            line: this.path(path).attr({stroke: color,
                                          fill: "none"}),
            from: obj1,
            to: obj2,
            // punk anfügen
            circle: this.ellipse(xc, yc , 20, 20).attr({fill: '#fff',
                                                      "fill-opacity": 1,
                                                      "stroke-width":0 })
            // EO punk anfügen
        };
    }
};


// Start
/*
	zunächst 3 Funktion während der Bewegung
	_start
	_move
	_end
*/
var onStart = function () {
	// wenn es ein icon ist (also droppable), dann brauchen wir auch die koordinaten
  // des zugehörigen Handles
	if ( icons[this.id] !== undefined ){
		this.oxh = r.getById( icons[this.id] ).attr("cx");
		this.oyh = r.getById( icons[this.id] ).attr("cy");
	}
	// Ansonsten brauchen wir das nicht
	else {
		this.oxh = 0;
		this.oyh = 0;
	}
	// in Beiden fällen brauchen wir aber die x und y koordinate.
	// rect und image beziehen sich auf den Punkt links oben, circles auf ihren center
	this.ox = (this.type == "rect" || this.type == "image") ?
             this.attr("x") :
             this.attr("cx");
	this.oy = (this.type == "rect" || this.type == "image") ?
             this.attr("y") :
             this.attr("cy");

};

var onMove = function (dx, dy) {

	// wieder die unterscheidung zwischen rect/image und circles
	// gleichzeitig addieren wir das delta
    var att = (this.type == "rect"|| this.type == "image") ?
              {x: this.ox + dx, y: this.oy + dy} :
              {cx: this.ox + dx, cy: this.oy + dy};

    // wir setzen die neue x/y koordinate
    this.attr(att);

    // falls wir ein Icon draggen, müssen wir den Handle mitbewegen
    if( icons[this.id] !== undefined ){
        // zugehörigen Handle aus liste bekommen
        var thisTarget = r.getById( icons[this.id] );

        // mit denen aus onStart festgelegeten werten ebenfalls die
        // neue Position errechnen
	    thisTarget.attr({ cx: this.oxh + dx, cy: this.oyh + dy });
    }
    // console.log("path: "+ r.getById(icons[this.id]).path);
    // Connections Updaten
    for (var i = connections.length; i--;) {
        r.connection(connections[i]);
    }
    // keine ahnung was das hier macht, aber es sieht cool aus
    r.safari();
};


var onEnd = function(eve) {
	eve.stopPropagation();

	// falls wir keinen handle haben, brauchen wir auch nichts machen
	if ( handles[this.id] === undefined ) return;

	// wenn doch müssen wir leider alle Icons durchgehen
	// wir wollen einen »drop« auf ein Icon aufspüren
	for( var i in icons ){

		// Raphael.isBBoxIntersect -> checkt ob es eine überlagerung gibt.
		// die interessiert uns aber nur wenn es nicht der zugehörige
    // handle ist -> && handles[this.id] !== i
		if ( Raphael.isBBoxIntersect(this.getBBox(),r.getById(i).getBBox()) &&
                                 handles[this.id] !== i ){

		    // beide Icons verbinden
			addConnection(handles[this.id], i);

		    // nun wollen wir den alten Handle wieder zum Ursprung zurücklegen
			var i = {
			    x: r.getById(handles[this.id]).attr('x') +
             r.getById(handles[this.id]).attr('width'),
			    y: r.getById(handles[this.id]).attr('y')
		    };
			this.attr({ cx: i.x, cy: i.y });
      console.log(this.attr);

			// und wir müssen nochmal die connections aktualisieren
			for (var j = connections.length; i--;) {
		        r.connection(connections[i]);
		  }
      // r.getById(icons[this.id]).hide();
		}
	}
};


/*
	globaler shit. auf den müssen wir zwischendurch immer wieder zugreifen
	r = »Paper«. Quasi der Verwalter des Zeichnung und der Zeichenfläche.
      Mapping zur Zeichenfläche via die ID »holder«
	-> <div id="holder"></div>

	icons -> array mit ids der Icons. Sind quasi die Zielflächen
	hanldes -> nur handles (fuchsia punkte) können verbindungen herstellen
	connections -> linie zwischen zwei punkten sind ein eigenes Objekt,
                  bestehend aus einem Punkt und einer Linie
*/
var r = Raphael("holder", 4096, 2160);
var icons   = [];
var handles = [];
var connections = [];


// Helfer Funktionen
/*
	addAss
	erstellt ein neues Set bestehend aus Icon und Target (=Handle).
	dieses Set wird in die entsprechenden globalen listen eingetragen,
  eingezeichnet und eventListener angeheftet
*/
function addAss(){

  var icon = r.image('http://placekitten.com/g/200/200',10, 10, 100, 100)
    .attr({ "stroke-width":0 , cursor: "move"})
    .drag(onMove, onStart, onEnd)
    .dblclick(function(eve){
      eve.stopPropagation();
      console.log('clicked on Icon '+this.id);})
      .id;


    var i = {
      x: r.getById(icon).attr('x') + r.getById(icon).attr('width'),
      y: r.getById(icon).attr('y')
    };

    var targ = r.ellipse(i.x, i.y, 20, 20)
    .attr({fill: 'fuchsia', "stroke-width":0, cursor: "move"})
    .drag(onMove, onStart, onEnd)
    .click(function(eve){ eve.stopPropagation(); })
    .id;

    // console.log(menu);
    console.log(r.getById(targ));
    console.log(r.getById(icon));
    // icon.dblclick(function() { menu.menu("image", targ) });

    // Icon und Handle verbinden
    addConnection(icon, targ);

    // eintragen
    icons[icon]   = targ;
    handles[targ] = icon;
    return;
}

/*
	addConnections ausgelagert
	brauchen wir an mehreren stellen
	notwendige Parameter sind (oh wunder) die Beiden elemente die wir verbinden wollen
*/
function addConnection(leftOne, rightOne){
    connections.push( r.connection( r.getById(leftOne), r.getById(rightOne), "#fff"));
    var self_id = connections[ connections.length-1 ].circle.id;
    r.getById(self_id)
     .dblclick(function(eve){
       eve.stopPropagation();
       console.log('clicked on line '+self_id);
      //  menu.menu("line", r.getById(self_id));
    });
    icons[self_id]= -1;
    console.log('foobar: '+ self_id);
}

/*
	Init stuff
*/

// prepopulate with first element
// addAss();


// Eventlistener to holder div to open/close Menu
var menu = new Menu();
document.querySelector('[data-trigger="add_element"]')
        .addEventListener('dblclick', function() { menu.menu(); });

// var hammerelement = document.getElementById('holder');
// Hammer(hammerelement).on('press', function() {
//   menu.menu();
// });
