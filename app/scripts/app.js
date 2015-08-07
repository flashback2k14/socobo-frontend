(function(document) {
  "use strict";

  /**
   * global app object
   */
  var app = document.querySelector("#app");
  /**
   * declare variables
   */
  var docReady = false;
  var tbUsername = null;
  var tbUserEmailAddress = null;
  var elLoginRegistration = null;
  var infoToast = null;

  /**
   * global eventlistener
   */
  app.addEventListener("dom-change", function() {
    console.log("Socobo Frontend app is ready to rock!");
  });

  /**
   * init variables after all components initialized
   */
  window.addEventListener("WebComponentsReady", function() {
    // imports are loaded and elements have been registered
    docReady = true;
    tbUsername = document.querySelector("#tbUserName");
    tbUserEmailAddress = document.querySelector("#tbUserEmailAddress");
    elLoginRegistration = document.querySelector("#elLoginRegistration");
    infoToast = document.querySelector("#info-toast");
  });

  /**
   * close drawer after menu item is selected
   */
  app.onMenuSelect = function() {
    var drawerPanel = document.querySelector("#paperDrawerPanel");
    if (docReady) {
      if (drawerPanel.narrow) {
        drawerPanel.closeDrawer();
      }
    }
  };

  /**
   * BEGIN: handle custom events for socobo elements here
   */
  app.closeLoginRegistrationElement = function() {
    app.route = "home";
  };

  app.loginSuccessful = function(e) {
    // get emailaddress from parameter
    var userEmailAddress = e.detail.user.password.email;
    // go to the home element
    app.route = "home";
    // set user info to toolbar menu
    tbUsername.innerHTML = Util.getUsernameFromMailAddress(userEmailAddress);
    tbUserEmailAddress.innerHTML = userEmailAddress;
    // show toast to inform the user
    infoToast.text = "User " + userEmailAddress + " is logged in!";
    infoToast.toggle();
  };

  app.loginFailed = function(e) {
    // show toast to inform the user
    infoToast.text = "Login failed! Please retry! Error: " + e.detail.error.error;
    infoToast.toggle();
  };

  app.passwordsMisMatching = function() {
    // show toast to inform the user
    infoToast.text = "Your Passwords does not match! Please retry!";
    infoToast.toggle();
  };
  /**
   * END: handle custom events for socobo elements here
   */

  /**
   * show toast after caching is completed
   */
  //app.displayInstalledToast = function() {
  //  document.querySelector("#caching-complete").show();
  //};

})(document);
