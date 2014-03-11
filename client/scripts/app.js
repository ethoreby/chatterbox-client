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
  // var param = encodeURIComponent(JSON.stringify({"where":{"username":"shawndrost"}}));

  // console.log(param);
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox/',
    data: {

      "where": {
        "username": "shawndrost"
      }
    },
    success: function (data) {
      console.dir(data);
      console.log('chatterbox: Message rec');
      $('.messages').remove();
      data.results.forEach(function(msg) {
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
  // console.dir(message);
  var $renderedMsg = $("<div class = 'messages'></div>");
  $renderedMsg.text(message.username + ": " + message.text);
  $(".chatDisplay").append($renderedMsg);
};

var updating = setInterval(app.fetch, 5000);

$(document).on("ready", function() {

  $(".send").on("click", function() {
    var input = $(".sendText").val();
    var message = {
      'username': "TheRealCharles",
      'text': input,
      'roomname': "default"
    };

    app.send(message);
    app.fetch();
  });

});





















