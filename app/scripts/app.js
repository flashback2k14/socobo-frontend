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
    // declare variable
    var userObj;
    var userName;
    var userEmailAddress;
    // init variable
    userObj = e.detail.user;
    // get emailaddress from parameter
    if (userObj.hasOwnProperty("password")) {
      userEmailAddress = userObj.password.email;
      // get user name from emailaddress
      userName = Util.getUsernameFromMailAddress(userEmailAddress);
    } else {
      /**
       * ToDo: Get Emailaddress and Username from Social Provider
       */
      userName = "";
      userEmailAddress = "";
    }
    // set user info to local storage
    UserInfo.set("UserObj", userObj);
    UserInfo.set("Id", userObj.uid);
    UserInfo.set("ExpireDate", userObj.expires);
    UserInfo.set("Username", userName);
    UserInfo.set("EmailAddress", userEmailAddress);
    // set user info to toolbar menu
    tbUsername.innerHTML = userName;
    tbUserEmailAddress.innerHTML = userEmailAddress;
    // go to the home element
    app.route = "home";
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

  app.logoutUser = function() {
    // show toast to inform the user
    infoToast.text = "Logging out...";
    infoToast.toggle();
    // log user out from firebase
    var rootRef = new Firebase("https://socobo.firebaseio.com/");
    rootRef.unauth();
    // set Placedolder to toolbar menu
    tbUsername.innerHTML = "Placeholder Username";
    tbUserEmailAddress.innerHTML = "Placeholder Email";
    // delete all data in local storage
    UserInfo.deleteAll();
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

}(document));
