var Menu =  function() {
  var self = this,
  thisContext = "",
  contextDic = {},
  menuEnabled = false;

  function menu(context, element) {
    if (!menuEnabled) {
      openMenu(context, element);
      menuEnabled = true;
    } else {
      closeMenu();
      menuEnabled = false;
    }
    return self;
  }

  function openMenu(context, element){
    document.body.appendChild( createMenuForContext(context, element) );
    return self;
  }

  function closeMenu(){
    document.body.removeChild( document.getElementById('menu') );
  }

  function createMenuForContext(context, element){
    var div = document.createElement('div'),
    divExit = document.createElement('div'),
    divWidth = 0,
    divHeight  = 0;
    div.style.background = "black";
    div.style.zIndex = 1000;
    div.id =  "menu";

    divExit.className = "menu-item";
    divExit.addEventListener("click", function() { menu(); });
    divExit.innerHTML = "exit";

    if (context == "image") {
      var divEditPerson = document.createElement('div'),
      divRelation = document.createElement('div');
      divEditPerson.className = "menu-item";
      divRelation.className = "menu-item";
      divRelation.addEventListener("click", function(){ menu();  }); //TODO: relation hide unhide
      divEditPerson.addEventListener("click", function() { menu(); })
      divRelation.innerHTML = "beziehung";
      divEditPerson.innerHTML = "bearbeiten";
      div.appendChild(divRelation);
      div.appendChild(divEditPerson);
      console.log(element)
    } else if (context == "line") {
      var divRelation = document.createElement('div');
      divRelation.className = "menu-item";
      divRelation.addEventListener('click', function() { menu(); });
      divRelation.innerHTML = "beziehung";
      div.appendChild(divRelation);
    } else {
      var divAddPerson = document.createElement('div');
      divAddPerson.className = "menu-item";
      divAddPerson.addEventListener("click", function() { addAss(); menu(); });
      divAddPerson.innerHTML = 'add Person';
      div.appendChild(divAddPerson);
    }
    div.appendChild(divExit);
    return div;
  }

  this.menu = menu;
  return this;
};
