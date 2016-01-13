function Output (outputEl) {
  return {
    _content: '',
    _id: 0,
    _registerCallback: function (func) {
      return this._id;
    },
    safe: function (str) {
      return str.replace(/\</g, '&lt;');
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
    addNodeMouseOver: function (label, funcOver, funcOut, classes, inline) {
      return this.add(this.linkMouseOver(
        label,
        funcOver,
        funcOut,
        'node ' + classes, 
        inline,
        ['<div', '</div>']
      ));
    },
    link: function (label, func, classes, inline) {
      var funcName = '__func' + this.id();

      window[funcName] = func;
      return '<a href="javascript:' + funcName + '()" class=' + classes + ' style="' + inline + '">' + label + '</a>';
    },
    linkMouseOver: function (label, funcOver, funcOut, classes, inline, tag) {
      var funcOverName = '__funcOver' + this.id();
      var funcOutName = '__funcOut' + this.id();

      tag = tag || ['<a href="javascript:void(0);"', '</a>'];
      window[funcOverName] = funcOver;
      window[funcOutName] = funcOut;

      return tag[0] + ' ' + 
        'onmouseover="javascript:' + funcOverName + '()" ' +
        'onmouseout="javascript:' + funcOutName + '()" ' +
        'class="' + classes + '" style="' + inline + '">' + label + tag[1];
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
};