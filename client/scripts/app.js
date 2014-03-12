var app = {};
window.app = app;

  //variables
app.server = "https://api.parse.com/1/classes/chatterbox/";
app.user = prompt('What is your name?');
app.selRoom = null;
app.selUser = null;
app.friends = {};
app.rooms = {};





//click listeners
app.init = function() {

  //cached jQuery references
  app.$chatDisplay = $(".chatDisplay");
  app.$dropdown = $(".dropdown");

  $(".send").on("click", function(event) {
    event.preventDefault();
    var input = $(".sendText").val();
    $(".sendText").val("");
    var message = {
      "username": app.user,
      "text": input,
      "roomname": app.$dropdown.val(),
    };
    console.log(message);
    app.send(message);
    app.fetch();
  });

  $(".createRoom").on("click", function(event) {
    event.preventDefault();
    var newRoom = prompt("What is the name of your new room?");
    var message = {};
    message["roomname"] = newRoom;
    console.log(message);
    app.generateRooms(message);
    app.fetch();
  });

  app.$chatDisplay.on('click',".username", function(){
    app.selUser = ($(this).text());
     app.fetch();
  });

  app.$chatDisplay.on('click', ".addFriend", function() {
    var name = $(this).parent().find('.username').text();
    app.toggleFriend(name);
    app.fetch();
  });

  app.$dropdown.change(function () {
     app.selRoom = $('select').val();
     app.fetch();
  });

  app.fetch();
};

app.send = function(message) {
  $.ajax({
    url: app.server,
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
  var params = {
    "order": "-createdAt",
    "where": {}
  };

  if (app.selRoom){
    params['where']['roomname'] = app.selRoom;
  }
  if (app.selUser){
    params['where']['username'] = app.selUser;
  }

  $.ajax({
    url: app.server,
    data: params,
    success: function (data) {
      $('.chat').remove();
      data.results.forEach(function(msg) {
        if (msg.roomname && msg.username) {
          app.display(msg);
          app.generateRooms(msg);
        }
      });
     },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to rec message');
    }
  });
};

app.generateRooms = function (message) {
  if (!app.rooms[message.roomname]) {
    app.rooms[message.roomname] = true;
    var roomOption = $("<option></option>");
    roomOption.text(message.roomname);
    app.$dropdown.append(roomOption);
  }
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
  var $barney = $("<img class = 'addFriend' src = 'images/barney.jpeg'> </img>");
  $messageContent.append($barney);

  if (app.friends[message.username]) {
    $userName.toggleClass('userFriend');
    $barney.toggleClass('friended');
  }

  app.$chatDisplay.append($messageContent);

};

app.toggleFriend = function(name) {
  if (app.friends[name] === undefined) {
    app.friends[name] = true;
    app.fetch();
  } else {
    delete app.friends[name];
  }
};

var updating = setInterval(app.fetch, 5000);






















