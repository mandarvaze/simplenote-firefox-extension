function onLoad(){
//    alert("Load");
}

var simplenote = {
  newNote: function() {
    alert("New Note");
  },

  saveNote: function() {
      alert("Save Note");
  },

  deleteNote: function() {
    var promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                                  .getService(Components.interfaces.nsIPromptService);

    if (promptService.confirm(window, "Confirm", "Are you sure you want to delete the note ?")) {
      alert("OK, deleting the note now");
    } else {
      alert("Good choice, Not deleting the note");
    }
  }
};
