var el = function (selector) {
  return document.querySelector(selector);
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

function getSourceCode (loc, input) {
  var lines = input.split('\n');
  var content = [], from, to, line;
  var startLine = loc.start.line-1;
  var endLine = loc.end.line-1;

  for (var i=startLine; i<=endLine; i++) {
    line = lines[i];
    if (!line) return content.join('\n');
    if (i === startLine) {
      from = loc.start.column;
      to = i === endLine ? loc.end.column : line.length;
    } else if (i === endLine) {
      from = 0;
      to = loc.end.column;
    } else {
      from = 0;
      to = line.length;
    }
    content.push(line.substr(from, to-from));
  }
  return content.join('\n');
};

function formatLocString (node, input) {
  var loc = node.loc;
  var positions = locToPos(input, loc.start, loc.end);
  var alertStr = '';
  var compareLocWithPoss = function (node, input) {
    if (
      typeof node.start !== 'undefined' &&
      typeof node.end !== 'undefined' &&
      (node.start !== positions.start ||
      node.end !== positions.end)
    ) {
      alertStr = 'Expected:\\n';
      alertStr += '  node.start (' + node.start + ') = loc.start.column (' + positions.start + ')\\n';
      alertStr += '  node.end (' + node.end + ') = loc.end.column (' + positions.end + ')';
      return '<a href="javascript:alert(\'' + alertStr + '\');" class="positions-mismatch">!</a>'
    }
    return '';
  };

  return [
    ' <small class="soft">',
    loc.start.line + ':',
    loc.start.column + '-',
    loc.end.line + ':',
    loc.end.column,
    compareLocWithPoss(node, input),
    '</small>'
  ].join('');
};

function currentSelectionToLoc (area) {
  var textLines = area.value.substr(0, area.selectionStart).split("\n");
  var currentLineNumber = textLines.length;
  var currentColumnIndex = textLines[textLines.length-1].length;

  return { line: currentLineNumber, column: currentColumnIndex };
};

function createSelection (area, input, startLoc, endLoc) {
  var positions = locToPos(input, startLoc, endLoc);

  area.selectionStart = positions.start;
  area.selectionEnd = positions.end;
};

function locToPos (input, startLoc, endLoc) {
  var line = 0, linePos = 0, startPos, endPos, newLine = false;
  
  for (var i=0; i<=input.length; i++) {
    if (input.charAt(i) === '\n') {
      newLine = true;
    }
    if (line === startLoc.line-1 && linePos === startLoc.column) {
      startPos = i;
    }
    if (line === endLoc.line-1 && linePos === endLoc.column) {
      endPos = i;
    }
    if (newLine) {
      newLine = false;
      linePos = 0;
      ++line;
    } else {
      ++linePos;  
    }
  }
  return { start: startPos, end: endPos };
};

function clearSelection (area) {
  area.selectionStart = area.selectionEnd = 0;
};