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
  var imgUserProfilePicture = null;
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
    imgUserProfilePicture = document.querySelector("#imgUserProfilePicture");
    elLoginRegistration = document.querySelector("#elLoginRegistration");
    infoToast = document.querySelector("#info-toast");
    // set Base URL to Firebase Database
    app.firebasebaseurl = "https://socobo.firebaseio.com/";
    // check if user login is expired
    if (Util.isUserLoginExpired(UserInfo.get(UserInfo.EXPIREDATE))) {
      app.route = "login";
    } else {
      // set UserInfo to Sidebar after reload
      tbUsername.innerHTML = UserInfo.get(UserInfo.USERNAME);
      tbUserEmailAddress.innerHTML = UserInfo.get(UserInfo.EMAILADDRESS);
      imgUserProfilePicture.src = UserInfo.get(UserInfo.PROFILEIMAGE);
      // navigate to home
      app.route = "home";
    }
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
  app.closeAuthElement = function() {
    app.route = "home";
  };

  app.loginSuccessful = function(e) {
    // declare variable
    var userObj;
    var userName;
    var userEmailAddress;
    var userProfilePicture;
    // init variable
    userObj = e.detail.user;
    // get emailaddress, username, profileUrl
    switch(userObj.provider) {
      case "password":
        userEmailAddress = userObj.password.email;
        userName = Util.getUsernameFromMailAddress(userEmailAddress);
        userProfilePicture = userObj.password.profileImageURL;
        break;
      case "google":
        userName = userObj.google.displayName;
        userEmailAddress = Util.getEmailAddressFromSocialProvider(userObj.google);
        userProfilePicture = userObj.google.profileImageURL;
        break;
      case "twitter":
        userName = userObj.twitter.displayName;
        userEmailAddress = Util.getEmailAddressFromSocialProvider(userObj.twitter);
        userProfilePicture = userObj.twitter.profileImageURL;
        break;
      case "facebook":
        userName = userObj.facebook.displayName;
        userEmailAddress = Util.getEmailAddressFromSocialProvider(userObj.facebook);
        userProfilePicture = userObj.facebook.profileImageURL;
        break;
    }
    // set user info to local storage
    UserInfo.set(UserInfo.USEROBJECT, Util.objectToString(userObj));
    UserInfo.set(UserInfo.USERID, userObj.uid);
    UserInfo.set(UserInfo.EXPIREDATE, userObj.expires);
    UserInfo.set(UserInfo.USERNAME, userName);
    UserInfo.set(UserInfo.EMAILADDRESS, userEmailAddress);
    UserInfo.set(UserInfo.PROFILEIMAGE, userProfilePicture);
    // set user info to toolbar menu
    tbUsername.innerHTML = userName;
    tbUserEmailAddress.innerHTML = userEmailAddress;
    imgUserProfilePicture.src = userProfilePicture;
    // go to the home element
    app.route = "home";
    // show toast to inform the user
    infoToast.text = "User " + userEmailAddress + " is logged in!";
    infoToast.style.background = '#2EB82E';
    infoToast.style.color = '#EEEEEE';
    infoToast.toggle();
  };

  app.loginFailed = function(e) {
    // show toast to inform the user
    var errorObj = e.detail.error;
    infoToast.text = "Login failed! Please retry! Error Code: " + errorObj.code + ", Error: " + errorObj.message;
    infoToast.style.background = "#FF3333";
    infoToast.style.color = "#EEEEEE";
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
    imgUserProfilePicture.src = "../images/touch/icon-128x128.png";
    // delete all data in local storage
    UserInfo.deleteAll();
    // go to login element
    app.route = "login";
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
