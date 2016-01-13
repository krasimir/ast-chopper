function Examples () {
  var select = el('.js-select-examples');
  var examples = {
    'e1': {
      code: './fixtures/1/code',
      ast: './fixtures/1/ast'
    }
  };
  var fetch = function (url, el) {
    $.ajax({
      url: url,
      context: document.body
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
      example = examples[e.target.value];
      fetch(example.code, el('#js-source'))
      fetch(example.ast, el('#js-ast'))
    }
  });
};
