module.exports = function (){
  var element = document.createElement("div");
  var head = document.createElement("h1");
  var button = document.createElement("a");
  head.innerHTML = "Hello, world!";
  button.innerHTML = "Do Something";
  button.className = "pure-button";
  element.appendChild(head);
  element.appendChild(button);
  element.id = "wrap";
  return element;
};
