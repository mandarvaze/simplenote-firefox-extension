var simplenote = {
  onLoad: function() {
    // initialization code
    this.initialized = true;
    this.strings = document.getElementById("simplenote-strings");
  },

  onMenuItemCommand: function(e) {
//    var promptService = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
//                                  .getService(Components.interfaces.nsIPromptService);
//    promptService.alert(window, "Message","Simplenote Dialog will be shown here !");
	window.openDialog("chrome://simplenote/content/simplenote.xul","simplenote-window",
                    "chrome,centerscreen");
  },

  onToolbarButtonCommand: function(e) {
    // just reuse the function above.  you can change this, obviously!
    simplenote.onMenuItemCommand(e);
  }
};

window.addEventListener("load", function () { simplenote.onLoad(); }, false);
