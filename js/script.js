window.onload = function () {

  var sourceEl = el('#js-source');
  var astEl = el('#js-ast');
  var outputEl = el('#js-output');
  var sourceCursor = el('#js-source-cursor');
  var source, ast;
  var output = Output(outputEl);
  var json;
  var nodesWithLoc = [];

  var readNode = function (node, nesting, prop) {
    if (!node) return;

    var type, sourceCode, padding, props, id, attrLinkPlaceholder;

    type = readType(node) || output.safe(prop);
    padding = 'padding-left:' + (nesting*10) + 'px;';
    props = [];
    id = output.id();
    attrLinkPlaceholder = '<span id="props-link-id-' + id + '"></span>';

    // check for arrays
    if (Array.isArray(node)) {
      output.addNode((node.length > 0 ? arrow() : '') + output.safe(type), padding);
      node.forEach(function (n) {
        readNode(n, nesting+1, prop);
      });
      return;
    }
    
    if (node.loc) {
      nodesWithLoc.push({ node: node, id: id });
      sourceCode = getSourceCode(node.loc, source);
      output.addNodeMouseOver(
        [
          arrow(),
          output.safe(type),
          formatLocString(node, source),
          attrLinkPlaceholder,
          (sourceCode !== '' ? '<pre>' + output.safe(sourceCode) + '</pre>' : '')
        ].join(''),
        function () {
          createSelection(sourceEl, source, node.loc.start, node.loc.end);
        },
        function () {
          clearSelection(sourceEl);
        },
        'selection-link',
        padding,
        id
      );
    } else {
      if (hasChildren(node)) {
        output.addNode(arrow() + output.safe(type) + attrLinkPlaceholder, padding);
      } else {
        return;
      }
    }
    
    // deeper and deeper
    for(var prop in node) {
      if (prop !== 'loc' && typeof node[prop] === 'object' && node[prop] !== null) {
        readNode(node[prop], nesting+1, prop); 
      } else {
        props.push({ name: prop, value: node[prop] });
      }
    }

    placePropertiesLink(id, output, props);
  };

  var parse = function () {
    var currentSource = sourceEl.value;
    var currentAST = astEl.value;

    if (!!currentSource && !!currentAST && (source !== sourceEl.value || ast !== astEl.value)) {
      source = sourceEl.value;
      ast = astEl.value;
      try {
        json = JSON.parse(ast);
      } catch(err) {
        console.log(err);
        output.error('AST should be a valid JSON.');
        return;
      }

      output.clear();
      readNode(json, 0, '');
      output.publish();
    }
  };

  var displaySourceCursorPosition = function () {
    var cursor = currentSelectionToLoc(sourceEl);

    sourceCursor.innerHTML = [
      sourceEl.selectionStart,
      '<br />',
      cursor.line + ':' + cursor.column
    ].join('');
  };
  var getRawSourceCode = function () {
    return source;
  };
  var getNodesWithLoc = function () {
    return nodesWithLoc;
  };

  setInterval(parse, 500);
  setInterval(displaySourceCursorPosition, 10);

  Examples();
  Travel(
    getNodesWithLoc,
    getRawSourceCode,
    createSelection.bind(this, sourceEl)
  );

};
