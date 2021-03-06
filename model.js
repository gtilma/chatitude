  (function () {
    var messagesList = [];

    var formatTime = function(timestamp){
      var date = new Date(timestamp * 1000);
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var timeValue = "" + ((hours > 12) ? hours - 12 : hours);
      timeValue += ((minutes < 10) ? ":0" + minutes : ":" + minutes);
      timeValue += (hours >= 12) ? " pm" : " am";
      return timeValue;
    };

    ChatModel = {
      signup: function (username, password) {
        $.ajax({
          type: 'POST',
          url: 'http://chat.api.mks.io/signup',
          data: {'username': username, 'password': password},
          success: function() {
            App.pubsub.emit('signedup', username, password);
          },
          error: function (data) {
            try {
              var responseText = JSON.parse(data.responseText);
              alert(responseText.errors.join(', '));
            } catch(e) {}
          }
        });
      },

      signin: function (username, password) {
        $.ajax({
          type: 'POST',
          url: 'http://chat.api.mks.io/signin',
          data: { 'username': username, 'password': password },
          success: function (data) {
            localStorage.setItem('API', data.apiToken);
            localStorage.setItem('userName', username);
            App.pubsub.emit('signedin');
          },
          error: function (data) {
            try {
              var responseText = JSON.parse(data.responseText);
              alert(responseText.errors.join(', '));
            } catch(e) { alert('Bad login'); }
          }
        });
      },

      getMessages: function(){
        $.ajax({
          type: 'GET',
          url: 'http://chat.api.mks.io/chats',
          success: function (data) {
            messagesList  = data;
            for(var i = 0; i < messagesList.length; i++){
              if (typeof messagesList[i].message !== 'string') continue;
              messagesList[i].message = messagesList[i].message.replace(/</g, '&lt;').replace(/>/g, '&gt;');

              messagesList[i].time = formatTime(messagesList[i].time);
              
              App.pubsub.emit('postmessage', messagesList[i]);
            }
          },
          error: function (data) {
            try {
              var responseText = JSON.parse(data.responseText);
              alert(responseText.errors.join(', '));
            } catch(e) {}
          }
        });
      },

      sendMessage: function(message){
        $.ajax({
          type: 'POST',
          url: 'http://chat.api.mks.io/chats',
          data: { 'apiToken': localStorage.getItem('API'), 'message': message},
          success: function () {
            App.pubsub.emit('refresh');
          },
          error: function (data) {
            try {
              var responseText = JSON.parse(data.responseText);
              alert(responseText.errors.join(', '));
            } catch(e) {}
          }          
          //sent successfully, prepend new message or refresh feed
        });
      },

      isSignedin: function(){
        return (localStorage.getItem('API') != null);
      }
    }
  })();