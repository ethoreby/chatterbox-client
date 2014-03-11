var app = {};
var user = prompt('What is your name?');

var selRoom = null;
var selUser = null;
var friends = [];

app.init = function() {
  app.fetch();
};

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
  var params = {
    "order": "-createdAt",
    "where": {}
  };

  if (selRoom){
    params['where']['roomname'] = selRoom;
  }
  if (selUser){
    params['where']['username'] = selUser;
  }

  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox/',
    data: params,
    success: function (data) {

      $('.chat').remove();
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

  var $renderedMsg = $("<div class='content'></div>");
  $renderedMsg.text(": " + message.text);

  var $userName = $("<span class = 'username'></span>");
  $userName.text(message.username);
  $renderedMsg.prepend($userName);

  var $roomName = $('<br/><br/><span class = "roomname"></span>');
  $roomName.text("roomname: " + message.roomname);
  $renderedMsg.append($roomName);

  var $messageContent = $("<div class='chat'></div>");
  $messageContent.append($renderedMsg);
  $messageContent.append("<img class = 'addFriend' src = 'images/barney.jpeg'> </img>");

  $(".chatDisplay").append($messageContent);
};

// var updating = setInterval(app.fetch, 5000);
//
app.toggleFriend = function(user) {
  console.log(user);
};

$(document).on("ready", function() {

  $(".send").on("click", function(event) {
    event.preventDefault();
    var input = $(".sendText").val();
    $(".sendText").val("");
    var message = {
      'username': user,
      'text': input,
      'roomname': "default"
    };

    app.send(message);
    app.fetch();
  });

  $(".chatDisplay").on('click',".username", function (){
    selUser = ($(this).text());
    app.fetch();
  });

  $(".chatDisplay").on('click', ".addFriend", function() {
    console.dir($(this).parent());
    var user = $(this).parent().firstChild().firstChild();
    app.toggleFriend(user.text());
  });

  app.init();
});





















