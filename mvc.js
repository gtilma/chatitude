// MVC
(function(){
  window.Messages = {};
  Messages.controller = {
    signin: function (user,pass) {
      if (!user || !pass) {
        App.pubsub.emit('error','You are missing something!');
      } else {
        ChatModel.signin(user, pass);
      }
    },

    signup: function (user,pass) {
      if (!user || !pass) {
        App.pubsub.emit('error','You are missing something!');
      } else {
        ChatModel.signup(user, pass);
      }
    },

    send: function (msgTxt) {
      if (!msgTxt) {
        App.pubsub.emit('error','You need to enter a message!');
      } else {
        ChatModel.sendMessage(msgTxt);
      }
    }
  };

  Messages.view = function(){
    App.pubsub.on('postmessage', function(messageObj){
      $("#allMessages").prepend($('<div>').append(messageObj.time + ': ' + messageObj.user + ': ' + '<span class="msgTxt">' + messageObj.message + '</span>'));
    });

    App.pubsub.on('refresh',function(){
      $("#allMessages").empty();
      ChatModel.getMessages();
    });

    App.pubsub.on('signedup', function(username,password) {
      Messages.controller.signin(username,password)
      $('#su_username').val('');
      $('#su_password').val('');
    });

    App.pubsub.on('signedin', function(username) {
      $('#signedInAs').html('You are signed in as <span class="signedInAs">' + localStorage.getItem('userName') + '</span>').show();
      $('#si_username').val('');
      $('#si_password').val('');
      $('#signin, #signup').hide();
      $('#send, #signOut').show();
    });

    App.pubsub.on('error', function(error){
      alert(error);
    });

    $('#signup').submit(function (e) {
      e.preventDefault();
      Messages.controller.signup($('#su_username').val(), $('#su_password').val());
    });

    $('#signin').submit(function (e) {
      e.preventDefault();
      Messages.controller.signin($('#si_username').val(), $('#si_password').val());
    });

    $('#send').submit(function (e) {
      e.preventDefault();
      Messages.controller.send($("#messageText").val());
      $("#messageText").val('');
    });

    $('body').on('click', '#signOut', function () {
      localStorage.removeItem('API');
      localStorage.removeItem('userName');
      $('#signin, #signup').show();
      $('#signedInAs, #send, #signOut').hide();
    });

    setInterval(function(){
      App.pubsub.emit('refresh');
    }, 5000);
  };

  Messages.render = function(){
    Messages.view();
    $("#parent").append($('<div id="messsagesParent">').append($('<h3>').text('Latest Messages'), $('<div id="allMessages">')));
    $('#parent').prepend($('<button class="button" id="signOut">').text('Sign Out'), $('<h3 id="signedInAs">').html('You are signed in as <span class="signedInAs">' + localStorage.getItem('userName') + '</span>'));
    if (ChatModel.isSignedin()) {
      $('#signedInAs').show();
      $('#signin, #signup').hide();
      $('#send').show();
    } else {
      $('#signedInAs, #send, #signOut').hide();
    }
    ChatModel.getMessages();
  };

  Messages.mount = function(){
    Messages.render();
  };
})();