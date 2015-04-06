var Menu =  function() {
  var self = this,
  thisContext = "",
  contextDic = {},
  menuEnabled = false;

  function menu(position, context, element) {
	var canvas = document.getElementById('c')
	if (position) {
		var x = typeof position.x !== 'undefined' ? position.x : window.innerWidth / 2;
		var y = typeof position.y !== 'undefined' ? position.y : window.innerHeights / 2; 
	} else {
		var x =  window.innerWidth / 2; 
		var y =  window.innerHeight / 2; 
	}
	
	if (!menuEnabled) {
		openMenu({'x': x, 'y': y}, context, element);
		menuEnabled = true;
	} else {
		closeMenu();
		menuEnabled = false;
	}
	return self;
  }

  function openMenu(position, context, element){
  	document.body.appendChild( createMenuForContext(position, context, element) );
  	return self;
  }

  function closeMenu(){
    document.body.removeChild( document.getElementById('menu') );
  }

  function createMenuForContext(position, context, element){
    var div = document.createElement('div'),
    divExit = document.createElement('div');
    divWidth = 0;
    divHeight  = 0;
    div.id =  'menu';

    divExit.className = 'menu-item';
    divExit.addEventListener('click', function() { menu(); });
    divExit.innerHTML = 'exit';

    if (context == "image") {
      var divDeletePerson = document.createElement('div'),
      divRelation = document.createElement('div');
      divDeletePerson.className = "menu-item";
      divRelation.className = "menu-item";
      divRelation.addEventListener("click", function(){ 
		var con = addConnection(element); 
		menu(); 
		newRelation(con.id, element.id, {});
	}); //TODO: relation hide unhide
      divDeletePerson.addEventListener("click", function() {
		removePerson(element);
		menu();
		deleteElement(element.id);
	})
      divRelation.innerHTML = "beziehung";
      divDeletePerson.innerHTML = "löschen";
      div.appendChild(divRelation);
      div.appendChild(divDeletePerson);
    } else if (context == "line") {
      var divRelation = document.createElement('div');
      divRelation.className = "menu-item";
      divRelation.addEventListener('click', function() {
		removeConnection(element); 
		menu();
		deleteElement(element.id);
	});
      divRelation.innerHTML = "löschen";
      div.appendChild(divRelation);
    } else {
      var divAddPerson = document.createElement('div');
      divAddPerson.className = "menu-item";
      divAddPerson.addEventListener("click", function() { 
	      var person = addPerson();
          var con = addConnection(person);
	      menu(); 
	      newPerson({'x': 50, 'y': 50}, person.id);
          newRelation(con.id, person.id, {});
	  });
      divAddPerson.innerHTML = 'add Person';
      div.appendChild(divAddPerson);
    }
    div.appendChild(divExit);
    div.style.left = position.x+'px';
    div.style.top = position.y+'px';
    return div;
  }

  this.menu = menu;
  return this;
};
