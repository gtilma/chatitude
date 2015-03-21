// MVP

window.Messages = [];

Messages.Presenter = function(){

  App.pubsub.on('postmessage', function(messageObj){
    $("#allMessages").prepend($('<div>').append(messageObj.time + ': ' + messageObj.user + ': ' + '<span class="msgTxt">' + messageObj.message + '</span>'));
  });

  App.pubsub.on('refresh',function(){
    $("#allMessages").empty();
    ChatModel.getMessages();
  });

  App.pubsub.on('signedup', function(username,password) {
    ChatModel.signin(username,password);
    $('#su_username').val('');
    $('#su_password').val('');
  });

  App.pubsub.on('signedin', function(username) {
    $('#signedInAs').text('You are signed in as ' + localStorage.getItem('userName')).show();
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
    var user = $('#su_username').val();
    var pass = $('#su_password').val();
    if (!user || !pass) {
      App.pubsub.emit('error','You are missing something');
    } else {
      ChatModel.signup(user, pass);
    }
  });

  $('#signin').submit(function (e) {
    e.preventDefault();
    var user = $('#si_username').val();
    var pass = $('#si_password').val();
    if (!user || !pass) {
      App.pubsub.emit('error','You are missing something');
    } else {
      ChatModel.signin(user, pass);
    }
  });

  $('#send').submit(function (e) {
    e.preventDefault();
    var msgTxt = $('#messageText').val();
    if (!msgTxt) {
      App.pubsub.emit('error','You need a message, dude!');
    } else {
      ChatModel.sendMessage(msgTxt);
    }
    $('#messageText').val('');
  });

  $('body').on('click', '#signOut', function () {
    localStorage.removeItem('API');
    localStorage.removeItem('userName');
    $('#signin, #signup').show();
    $('#signedInAs, #send, #signOut').hide();
  });

  setInterval(function(){
    App.pubsub.emit('refresh');
  }, 10000);

  this.render = function(){
    $("#parent").append(Messages.view());
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
};

Messages.view = function(){
  return $('<div id="messsagesParent">').append($('<h3>').text('Latest Messages'), $('<div id="allMessages">'));
};

Messages.mount = function(){
  var presenter = new Messages.Presenter();
  presenter.render();
};