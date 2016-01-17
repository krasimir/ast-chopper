function Examples () {
  var path = './fixtures/';
  var select = el('.js-select-examples');
  var query = queryString();
  var fetch = function (url, el) {
    $.ajax({
      url: url,
      context: document.body,
      dataType: 'text'
    }).done(function(res) {
      el.innerHTML = res;
    })
    .fail(function(err) {
      console.log(err);
    })
  };
  var showExample = function (folderName) {
    fetch(path + folderName + '/code.txt', el('#js-source'))
    fetch(path + folderName + '/ast.txt', el('#js-ast'))
  };

  select.addEventListener('change', function (e) {
    var example;

    if (e.target.value !== '') {
      showExample(e.target.value);
    }
  });

  if (query.example) {
    showExample(query.example);
  }
};

var queryString = function () {
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
        // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = decodeURIComponent(pair[1]);
        // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
      query_string[pair[0]] = arr;
        // If third or later entry with this name
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
  } 
    return query_string;
};
