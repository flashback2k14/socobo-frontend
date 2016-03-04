var webComponentsSupported = ("registerElement" in document &&
  "import" in document.createElement("link") &&
  "content" in document.createElement("template"));

function finishLazyLoading() {
  window.Polymer = window.Polymer || {dom: "shadow"};

  var onImportLoaded = function() {
    var loadEl = document.getElementById("splash");
    loadEl.addEventListener("transitionend", loadEl.remove);
    document.body.classList.remove("loading");
  };

  var link = document.querySelector("#bundle");

  if (link.import && link.import.readyState === "complete") {
    onImportLoaded();
  } else {
    link.addEventListener("load", onImportLoaded);
  }
}

if (!webComponentsSupported) {
  var script = document.createElement("script");
  script.async = true;
  script.src = "/bower_components/webcomponentsjs/webcomponents-lite.js";
  script.onload = finishLazyLoading;
  document.head.appendChild(script);
} else {
  finishLazyLoading();
}
