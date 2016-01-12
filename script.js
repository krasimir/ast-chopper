var el = function (selector) {
  return document.querySelector(selector);
};

window.onload = function () {

  var sourceEl = el('#js-source');
  var astEl = el('#js-ast');
  var outputEl = el('#js-output');
  var sourceCursor = el('#js-source-cursor');
  var source, ast;

  var output = {
    _content: '',
    _id: 0,
    _registerCallback: function (func) {
      return this._id;
    },
    clear: function () {
      this._content = '';
      return this;
    },
    add: function (str) {
      this._content += str;
      return this;
    },
    addNode: function (str, inline) {
      return this.add(this.div(str, 'node', inline));
    },
    link: function (label, func, classes, inline) {
      var funcName = '__func' + this.id();

      window[funcName] = func;
      return '<a href="javascript:' + funcName + '()" class=' + classes + ' style="' + inline + '">' + label + '</a>';
    },
    addTitle: function (str) {
      return this.add(this.div(str, 'title'));
    },
    publish: function () {
      outputEl.innerHTML = this._content;
      return this;
    },
    div: function (str, classes, inline) {
      return '<div class="' + classes + '" style="' + inline + '">' + str + '</div>';
    },
    error: function (str) {
      this
      .clear()
      .add(this.div(str, 'error'));
    },
    id: function () {
      return ++this._id;
    },
  };

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
    
    if (isNumber(node.start) && isNumber(node.end) && node.loc) {
      sourceCode = source.substr(node.start, node.end - node.start);
      output.addNode(
        arrow() + 
        type + ' <small class="soft">' + node.start + '-' + node.end + '</small>' +
        attrLinkPlaceholder +
        (sourceCode !== ''? '<pre>' + sourceCode + '</pre>' : ''),
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
    sourceCursor.innerHTML = sourceEl.selectionStart;
  };

  setInterval(parse, 500);
  setInterval(displaySourceCursorPosition, 10);

};

function placePropertiesLink (id, output, props) {
  // ATTENTION! dirty hacking ...
  setTimeout(function () {
    el('#props-link-id-' + id).innerHTML = output.link('properties', function () {
      alert(props.reduce(function (result, prop) {
        var value;

        try {
          value = prop.value !== null && typeof prop.value === 'object' ? 
            JSON.stringify(prop.value, null, 2) :
            prop.value;
        } catch(err) {
          console.log(err);
          value = prop.value;
        }

        return result += prop.name + '=' + value + '\n';
      }, ''));
    }, 'props-link');  
  }, 200);
}

function readType (node) {
  if (node.type && typeof node.type === 'string') return node.type;
  if (node.type && typeof node.type === 'object') return node.type.label;
  return false;
};

function isNumber (thing) {
  return typeof thing === 'number';
};

function hasChildren (ob) {
  var result = false;
  for (var prop in ob) {
    if (ob[prop] !== null && typeof ob[prop] === 'object') result = true;
  }
  return result;
};

function arrow () {
  return '<span style="display:inline-block;margin-right:2px;font-size:0.8em;">&#9484;</span>';
};