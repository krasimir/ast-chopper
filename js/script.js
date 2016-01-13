window.onload = function () {

  var sourceEl = el('#js-source');
  var astEl = el('#js-ast');
  var outputEl = el('#js-output');
  var sourceCursor = el('#js-source-cursor');
  var source, ast;
  var output = Output(outputEl);

  var readNode = function (node, nesting, prop) {
    if (!node) return;

    var type, sourceCode, padding, props, id, attrLinkPlaceholder;

    type = readType(node) || prop;
    padding = 'padding-left:' + (nesting*10) + 'px;';
    props = [];
    id = output.id();
    attrLinkPlaceholder = '<span id="props-link-id-' + id + '"></span>';

    // check for arrays
    if (Array.isArray(node)) {
      output.addNode((node.length > 0 ? arrow() : '') + type, padding);
      node.forEach(function (n) {
        readNode(n, nesting+1, prop);
      });
      return;
    }
    
    if (node.loc) {
      sourceCode = getSourceCode(node.loc, source);
      output.addNode(
        [
          arrow(),
          output.linkMouseOver(
            type,
            function () {
              createSelection(sourceEl, source, node.loc.start, node.loc.end);
            },
            function () {
              clearSelection(sourceEl);
            },
            'selection-link'
          ),
          formatLocString(node.loc),
          attrLinkPlaceholder,
          (sourceCode !== '' ? '<pre>' + sourceCode + '</pre>' : '')
        ].join(''),
        padding
      );
    } else {
      if (hasChildren(node)) {
        output.addNode(arrow() + type + attrLinkPlaceholder, padding);
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
    var json;

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

  setInterval(parse, 500);
  setInterval(displaySourceCursorPosition, 10);

  Examples();

};
