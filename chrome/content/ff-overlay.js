simplenote.onFirefoxLoad = function(event) {
  document.getElementById("contentAreaContextMenu")
          .addEventListener("popupshowing", function (e){ simplenote.showFirefoxContextMenu(e); }, false);
};

simplenote.showFirefoxContextMenu = function(event) {
  // show or hide the menuitem based on what the context menu is on
  document.getElementById("context-simplenote").hidden = gContextMenu.onImage;
};

window.addEventListener("load", function () { simplenote.onFirefoxLoad(); }, false);
