Template.player.rendered = function() {
  var winner = Songs.find({});
  var hook = winner.observeChanges({
    addedBefore: function(id, song){
      var duration = Session.get("time");
      var interval, timeLeft;
      timeLeft = function() {
        if (duration > 0) {
          duration--;
        }
        else {
          Meteor.call('setCurrent', id);
          return Meteor.clearInterval(interval);
        }
      };
      interval = Meteor.setInterval(timeLeft, 1000);
    }
  });
  
  var songs = Songs.find({
    current: true
  });
  var handle = songs.observeChanges({
    added: function(id, song) {
      var duration = song.duration;
      var interval, timeLeft;
      timeLeft = function() {
        if (duration > 0) {
          duration--;
          Session.set("time", duration);
        } else {
          Meteor.call('setDone', id);
          return Meteor.clearInterval(interval);
        }
      };
      interval = Meteor.setInterval(timeLeft, 1000);
    },
    removed: function() {
    }
  });
  
};

Template.player.helpers({
  'player': function() {
    return Songs.find({current:true});
  },
  'time': function() {
    return Session.get("time");
    
  }

});