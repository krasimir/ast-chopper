function Travel (getNodesWithLoc, getRawSourceCode, createSelection) {
  var next = el('.js-travel-next');
  var reset = el('.js-travel-reset');
  var status = el('.js-travel-status');
  var output = el('.js-output');
  var pos = 0;
  var obj, nodes, currentNode;

  next.addEventListener('click', select);
  reset.addEventListener('click', resetTravel);

  function select (obj) {
    nodes = getNodesWithLoc();
    obj = nodes[pos++];
    if (!obj) obj = nodes[pos = 0];
    createSelection(getRawSourceCode(), obj.node.loc.start, obj.node.loc.end);
    blink(el('#node' + obj.id));
    if (typeof obj.node.type === 'string') {
      setStatus(obj.node.type);
    }
  };

  function resetTravel () {
    pos = 0;
    select();
  };

  function setStatus (str) {
    status.innerHTML = str;
  }

  function blink(node) {
    if (currentNode) {
      currentNode.setAttribute('style', currentNode.defaultStyles);
    }
    if (!node) return;
    if (!node.defaultStyles) node.defaultStyles = node.getAttribute('style');
    node.setAttribute('style', node.defaultStyles + ';background:#000');
    if (node.scrollIntoView) node.scrollIntoView();
    currentNode = node;
  }
  
};