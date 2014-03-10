// YOUR CODE HERE:

var app = {};

app.init = function() {};

app.send = function(message) {

  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
};

app.fetch = function() {
  //  $.get('https://api.parse.com/1/classes/chatterbox', function(data) {
  //   console.log('data retreived');
  // });

  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    success: function (data) {
      console.log('chatterbox: Message rec');
      _.each(data.results, function(msg) {
        app.display(msg);
      });
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to rec message');
    }
  });
};

app.display = function(message) {
  console.dir(message);
};
