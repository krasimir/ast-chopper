function Examples () {
  var path = './fixtures/';
  var select = el('.js-select-examples');
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

  select.addEventListener('change', function (e) {
    var example;

    if (e.target.value !== '') {
      fetch(path + e.target.value + '/code.txt', el('#js-source'))
      fetch(path + e.target.value + '/ast.txt', el('#js-ast'))
    }
  });
};
