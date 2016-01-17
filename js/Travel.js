function Travel (getNodesWithLoc, getRawSourceCode, createSelection) {
  var next = el('.js-travel-next');
  var reset = el('.js-travel-reset');
  var status = el('.js-travel-status');
  var pos = 0;
  var obj, nodes;

  next.addEventListener('click', select);
  reset.addEventListener('click', resetTravel);

  function select (obj) {
    nodes = getNodesWithLoc();
    obj = nodes[pos++];
    if (!obj) obj = nodes[pos = 0];
    createSelection(getRawSourceCode(), obj.loc.start, obj.loc.end);
    if (typeof obj.type === 'string') {
      setStatus(obj.type);
    }
  };

  function resetTravel () {
    pos = 0;
    select();
  };

  function setStatus (str) {
    status.innerHTML = str;
  }
  
};