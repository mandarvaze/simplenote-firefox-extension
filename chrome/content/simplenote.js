var simplenotePrefs = {
   PREFERENCES_ROOT     : "extensions.simplenote.",

   init : function() {
      // connect to the preferences system
      this.root = Components.classes["@mozilla.org/preferences-service;1"].
                     getService(Components.interfaces.nsIPrefService).
                     getBranch(this.PREFERENCES_ROOT);
      //this.root.setString("authtok", "");
   },

   getString : function(value) {
      return this.root.getCharPref(value);
   },

   setString : function(key, value) {
      return this.root.setCharPref(key, value);
   }
};

var newnoteflag = false;
    notes = {};
    loggedIn = false;

function logMsg(msg) {
  dump(msg + '\n');
}

function fetchNote(Note) {
  url = "https://simple-note.appspot.com/api2/data/"+Note.key
  logMsg('Loading :' + url + '\n');

  let request = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"]
              .createInstance(Components.interfaces.nsIXMLHttpRequest);

  request.onload = function(aEvent) {
    noteListbox = document.getElementById("simplenote.mainwindow.notelist");
    responseText = aEvent.target.responseText;
    resp = JSON.parse(responseText);
    notes[resp.key].content = resp.content;
    header = notes[resp.key].content.split('\n')[0];
    // CODESMELL: Running this multiple times is dangerous, will keep adding duplicate entries
    noteListbox.appendItem(header, resp.key);
  };

  request.onerror = function(aEvent) {
    errorText = aEvent.target.responseText;
    alert('Error connecting to URL: '+ errorText);
  };

  request.open("GET", url, true);
  request.send(null);
}

var simplenote = {

  login: function() {
    // TODO : Check if we've already logged in
    // No need to login every time

    usr = simplenotePrefs.getString("username");
    passwd = simplenotePrefs.getString("passwd");
    reqBody = 'email='+usr+'&password='+passwd
  
    url = "https://simple-note.appspot.com/api/login"
    encodedData = window.btoa(reqBody);
  
    let request = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"]
                .createInstance(Components.interfaces.nsIXMLHttpRequest);
    request.onload = function(aEvent) {
      authtok = aEvent.target.responseText;
      simplenotePrefs.setString("authtok", authtok);
      loggedIn = true;
      logMsg('Login successful.')
    };
    request.onerror = function(aEvent) {
      errorText = aEvent.target.responseText;
      alert('Unable to login: '+ errorText);
    };

    request.open("POST", url, true);
    request.send(encodedData);
    //setTimeout(function(){alert('authtok pref: ' + simplenotePrefs.getString("authtok"));}, 1000);
  },

  loadNotes: function() {
    // TODO : Check if we've already logged in
    // if not, try logging in, else error

    notesToLoad = 100; //TODO : Retrieve from preference

    // https://simple-note.appspot.com/api2/index?length=[number of notes]&mark=[bookmark key]&since=[time value]&auth=[auth token]&email=[email]
    url = "https://simple-note.appspot.com/api2/index?length="+notesToLoad;
    logMsg('Loading notes from :' + url);

    let request = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"]
                .createInstance(Components.interfaces.nsIXMLHttpRequest);
    request.onload = function(aEvent) {
      responseText = aEvent.target.responseText;
      resp = JSON.parse(responseText);
      logMsg('Number of notes :' + resp.count)
      noteListbox = document.getElementById("simplenote.mainwindow.notelist");
      for (var i=0;i<resp.count;i++) {
        if (resp.data[i].deleted == 0) {
          key = resp.data[i].key;
          note = resp.data[i];

          notes[key] = note;
          fetchNote(note);
        }
      }
    };

    request.onerror = function(aEvent) {
      errorText = aEvent.target.responseText;
      alert('Error connecting to URL: '+ errorText);
    };

    request.open("GET", url, true);
    request.send(null);
  },

  newNote: function() {
    noteTextbox = document.getElementById("simplenote.mainwindow.notedata");
    noteTextbox.value = "";
    newnoteflag = true;
  },

  saveNote: function() {
    noteTextbox = document.getElementById("simplenote.mainwindow.notedata");
    userEnteredText = noteTextbox.value //BUG : Multiple lines not read

    if (userEnteredText.length <=0) {
      alert("Note is empty. Enter some text and then Save.");
      return;
    } else if (newnoteflag == false) {
        logMsg('Updating existing note');
        url = "https://simple-note.appspot.com/api2/data/"+
               selected_note.key + "?auth="+
               simplenotePrefs.getString("authtok") + "&email="+
               simplenotePrefs.getString("username");
      } else {
          logMsg('Creating new note');
          url = "https://simple-note.appspot.com/api2/data?auth="+
                 simplenotePrefs.getString("authtok") + "&email="+
                 simplenotePrefs.getString("username");
      }

    logMsg('Saving note - URL :' + url);

    var noteBody = '{"content" : "' + userEnteredText +'" }';

    let request = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"]
                .createInstance(Components.interfaces.nsIXMLHttpRequest);

    request.onload = function(aEvent) {
      responseText = aEvent.target.responseText;
      // TODO : Need to distinguish between new note and update note 
      logMsg('Update Note Responded with :' + responseText)
      alert('Saved');
    };

    request.onerror = function(aEvent) {
      newNoteKey = aEvent.target.responseText;
      alert('Error connecting to URL');
    };
    request.open("POST", url, true);
    request.send(noteBody);
    //setTimeout(function(){alert('Saved');}, 1000);
  },

  deleteNote: function() {
    var promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                                  .getService(Components.interfaces.nsIPromptService);

    noteListbox = document.getElementById("simplenote.mainwindow.notelist");

    if (promptService.confirm(window, "Confirm", "Are you sure you want to delete the note ?")) {
      var noteBody = '{"deleted" : 1}';
  
      url = "https://simple-note.appspot.com/api2/data/"+
             selected_note.key + "?auth="+
             simplenotePrefs.getString("authtok") + "&email="+
             simplenotePrefs.getString("username");
  
      logMsg('Deleting Note - URL :' + url);

      let request = Components.classes["@mozilla.org/xmlextras/xmlhttprequest;1"]
                  .createInstance(Components.interfaces.nsIXMLHttpRequest);
  
      request.onload = function(aEvent) {
        deleteResp = aEvent.target.responseText;
        logMsg('Delete Note Responded with :' + deleteResp);
        alert('Deleted');
      };
  
      request.onerror = function(aEvent) {
        deleteResp = aEvent.target.responseText;
        alert('Error connecting to URL');
      };
      request.open("POST", url, true);
      request.send(noteBody);
    } else {
      alert("Not deleting the note");
    }
  },

  populateTextbox: function() {
    noteTextbox = document.getElementById("simplenote.mainwindow.notedata");
    selected_note = notes[this.value]
    content = notes[this.value].content;
    if (content != undefined)
      noteTextbox.value = content;
  }
};

function onLoad(){
  simplenotePrefs.init();
  simplenote.login();
  document.getElementById("simplenote.mainwindow.notelist").onselect = simplenote.populateTextbox
  setTimeout(simplenote.loadNotes(), 1000);
}