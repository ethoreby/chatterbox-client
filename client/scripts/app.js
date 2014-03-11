var App = function() {
  this.user = prompt('What is your name?');
  this.selRoom = null;
  this.selUser = null;
  this.friends = {};

  var app = this;
  $(document).on("ready", function() {
    app.init();
  });
};

App.prototype.init = function() {
  var app = this;
  $(".send").on("click", function(event) {
    event.preventDefault();
    var input = $(".sendText").val();
    $(".sendText").val("");
    var message = {
      'username': app.user,
      'text': input,
      'roomname': "default"
    };

    app.send(message);
    app.fetch();
  });

  $(".chatDisplay").on('click',".username", function (){
    app.selUser = ($(this).text());
    app.fetch();
  });

  $(".chatDisplay").on('click', ".addFriend", function() {
    var name = $(this).parent().find('.username').text();
    app.toggleFriend(name);
    app.fetch();
  });

  app.fetch();
};

App.prototype.send = function(message) {

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

App.prototype.fetch = function() {

  var app = this;
  var params = {
    "order": "-createdAt",
    "where": {}
  };

  if (this.selRoom){
    params['where']['roomname'] = this.selRoom;
  }
  if (this.selUser){
    params['where']['username'] = this.selUser;
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

App.prototype.display = function(message) {

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
  var $barney = $("<img class = 'addFriend' src = 'images/barney.jpeg'> </img>");
  $messageContent.append($barney);

  if (this.friends[message.username]) {
    $userName.toggleClass('userFriend');
    $barney.toggleClass('friended');
  }

  $(".chatDisplay").append($messageContent);
};

// var updating = setInterval(app.fetch, 5000);
//
App.prototype.toggleFriend = function(name) {
  if (this.friends[name] === undefined) {
    this.friends[name] = true;
    this.fetch();
  } else {
    delete this.friends[name];
  }
};























