var el = function (selector) {
  return document.querySelector(selector);
};

window.onload = function () {

  var sourceEl = el('#js-source');
  var astEl = el('#js-ast');
  var outputEl = el('#js-output');
  var source, ast;

  var output = {
    _content: '',
    clear: function () {
      this._content = '';
      return this;
    },
    add: function (str) {
      this._content += str;
      return this;
    },
    addNode: function (str) {
      return this.add(this.div(str, 'node'));
    },
    addTitle: function (str) {
      return this.add(this.div(str, 'title'));
    },
    publish: function () {
      outputEl.innerHTML = this._content;
      return this;
    },
    div: function (str, classes) {
      return '<div class="' + classes + '">' + str + '</div>';
    },
    error: function (str) {
      this
      .clear()
      .add(this.div(str, 'error'));
    }
  };

  var readNode = function (node) {

    // check for arrays
    if (Array.isArray(node)) {
      node.forEach(function (n) {
        readNode(n);
      });
      return;
    }

    // make sure that we have start, end and loc
    if (!node.start && !node.end && !node.loc) return;

    // the actual content generation
    output.addNode(
      node.type + ' <small>' + node.start + '-' + node.end + '</small><br />' +
      '<pre>' + source.substr(node.start, node.end) + '</pre>'
    );

    // deeper and deeper
    for(var prop in node) {
      if (prop !== 'loc' && typeof node[prop] === 'object') {
        readNode(node[prop]);
      }
    }

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
        output.clear();
        output.addTitle('Program:');
        readNode(json.program);
      } catch(err) {
        console.log(err);
        output.error('AST should be a valid JSON.');
      }
      output.publish();
    }

  };

  var displaySourceCursorPosition = function () {
    console.log(sourceEl.selectionStart);
  };

  setInterval(parse, 500);
  setInterval(displaySourceCursorPosition, 10);

};