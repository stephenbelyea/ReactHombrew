module.exports = function (){
  var element = document.createElement("div");
  var head = document.createElement("h1");
  head.innerHTML = "Hello, world!";
  element.appendChild(head);
  element.setAttribute("id", "wrap");
  return element;
};
