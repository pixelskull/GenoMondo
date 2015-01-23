var Person = function() {
  var self = this,
  birthDate = new Date(),
  givenName = "",
  name = "",
  notes = "",
  image = "",
  targed = false;

  // functions
  function setBirthDate(date) {
    birthDate = date;
    return self;
  }

  function getBirthDate() {
    return birthDate;
  }

  function setGivenName(gname) {
    givenName = gname;
    return self;
  }
  return this;
};
