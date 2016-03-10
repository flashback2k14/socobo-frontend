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
  // Menu Profile Infos
  var tbUsername = null;
  var tbUserEmailAddress = null;
  var imgUserProfilePicture = null;
  // Menu Items
  var menuItemLogin = null;
  var menuItemHome = null;
  var menuItemRecipe = null;
  var menuItemInventory = null;
  var menuItemProfile = null;
  var menuItemAbout = null;
  // Socobo Elements
  var elAuth = null;
  var elRanking = null;
  var elGroceryList = null;
  var elInventory = null;
  var elRecipe = null;
  var elProfile = null;
  var elAbout = null;

  /**
   * global eventlistener
   */
  app.addEventListener("dom-change", function() {
    console.log("Socobo Project app is ready to rock!");
  });

  /**
   * init variables after all components initialized
   */
  window.addEventListener("WebComponentsReady", function() {
    // imports are loaded and elements have been registered
    docReady = true;
    // Menu Profile Infos
    tbUsername = document.querySelector("#tbUserName");
    tbUserEmailAddress = document.querySelector("#tbUserEmailAddress");
    imgUserProfilePicture = document.querySelector("#imgUserProfilePicture");
    // Menu Items
    menuItemLogin = document.querySelector("#menuItemLogin");
    menuItemHome = document.querySelector("#menuItemHome");
    menuItemRecipe = document.querySelector("#menuItemRecipe");
    menuItemInventory = document.querySelector("#menuItemInventory");
    menuItemProfile = document.querySelector("#menuItemProfile");
    menuItemAbout = document.querySelector("#menuItemAbout");
    // Socobo Elements
    elAuth = document.querySelector("#elAuth");
    elRanking = document.querySelector("#elRanking");
    elGroceryList = document.querySelector("#elGroceryList");
    elInventory = document.querySelector("#elInventory");
    elRecipe = document.querySelector("#elRecipe");
    elProfile = document.querySelector("#elProfile");
    elAbout = document.querySelector("#elAbout");
    // init UserInfo
    UserInfo.init("https://socobo-dev-project.firebaseio.com/");
    // set FirebaseUrl, UserId and ExpireDate for Subelements
    app.userlogin = UserInfo.getUserLogin();
    // check if user login is expired
    if (Util.isUserLoginExpired(UserInfo.get(UserInfo.EXPIREDATE))) {
      page.show("/");
    } else {
      // Show Menu Items
      Util.toggleMenuItems([
        menuItemLogin, menuItemHome, menuItemRecipe,
        menuItemInventory, menuItemProfile
      ]);
      // set email address to grocery list
      var userObj = Util.stringToObject(UserInfo.get(UserInfo.USEROBJECT));
      app.usermailaddress = Util.getUserEmailAddress(userObj);
      // load Ranking, Recipes and Profile
      elRanking.loadData(false);
      elGroceryList.loadData();
      elRecipe.loadData();
      elProfile.loadData();
      // navigate to home
      page.show("/home");
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
  /**
   * AUTH
   */
  app.closeAuthElement = function() {
    page.show("/about");
  };
  app.loginSuccessful = function(e) {
    // declare variable
    var userObj;
    // init variable
    userObj = e.detail.user;
    // set user info to local storage
    UserInfo.set(UserInfo.USEROBJECT, Util.objectToString(userObj));
    UserInfo.set(UserInfo.USERID, userObj.uid);
    UserInfo.set(UserInfo.EXPIREDATE, userObj.expires);
    // Show Menu Items
    Util.toggleMenuItems([
      menuItemLogin, menuItemHome, menuItemRecipe,
      menuItemInventory, menuItemProfile
    ]);
    // set UserId and ExpireDate for Subelements
    app.userlogin = UserInfo.getUserLogin();
    // set email address to grocery list
    app.usermailaddress = Util.getUserEmailAddress(userObj);
    // load Ranking, Grocery List, Recipes and Profile
    elRanking.loadData(false);
    elGroceryList.loadData();
    elRecipe.loadData();
    elProfile.loadData();
    // go to the home element
    page.show("/home");
  };
  app.loginFailed = function(e) {
    // get error object
    var errorObj = e.detail.error;
    // show toast to inform the user
    Util.notify(this, {
      type: "error",
      message: "Login failed! Please retry! Error Code: " + errorObj.code + ", Error: " + errorObj.message
    });
  };
  app.passwordsMisMatching = function() {
    // show toast to inform the user
    Util.notify(this, {
      type: "error",
      message: "Your Passwords does not match! Please retry!"
    });
  };
  /**
   * RANKING
   */
  app.handleAddMissingItemsToGroceryList = function(e) {
    var missingItems = e.detail;
    elGroceryList.addToList(missingItems);
  };
  /**
   * PROFILE
   */
  app.handleAccountDeleted = function() {
    this.logoutUser("Your Account is deleted!");
  };
  app.handleLoginExpired = function(e) {
    this.logoutUser(e.detail.value);
  };
  app.handleProfileDataChanged = function(e) {
    // set UserInfo to Menubar
    tbUsername.innerHTML = e.detail.name;
    tbUserEmailAddress.innerHTML = e.detail.email;
    imgUserProfilePicture.src = e.detail.profileImage;
    // set user info to local storage
    UserInfo.set(UserInfo.USERNAME, e.detail.name);
    UserInfo.set(UserInfo.EMAILADDRESS, e.detail.email);
    UserInfo.set(UserInfo.PROFILEIMAGE, e.detail.profileImage);
    // show toast to inform the user
    Util.notify(this, {
      type: "success",
      message: "User " + e.detail.email + " is logged in!"
    });
  };
  app.handleProfileImageChanged = function(e) {
    // set UserInfo to Menubar
    imgUserProfilePicture.src = e.detail.profileImage;
    // set user info to local storage
    UserInfo.set(UserInfo.PROFILEIMAGE, e.detail.profileImage);
  };
  app.handleProfileInfoChanged = function(e) {
    // set UserInfo to Menubar
    tbUsername.innerHTML = e.detail.name;
    tbUserEmailAddress.innerHTML = e.detail.email;
    // set user info to local storage
    UserInfo.set(UserInfo.USERNAME, e.detail.name);
    UserInfo.set(UserInfo.EMAILADDRESS, e.detail.email);
  };
  /**
   * PROJECT
   */
  app.handleGoToHome = function() {
    if (app.route !== "home") {
      page.show("/home"); 
    }
  };
  
  app.logoutUser = function(text) {
    var infoText = "";
    if (typeof text === "string") {
      infoText = text;
    } else {
      infoText = "Logging out...";
    }
    // show toast to inform the user
    Util.notify(this, {
      message: infoText
    });
    // unregister tracking listeners
    elRanking.unregisterListeners();
    elGroceryList.unregisterListeners();
    // log user out from firebase
    var rootRef = new Firebase(UserInfo.getBaseUrl());
    rootRef.unauth();
    // set Placedolder to toolbar menu
    tbUsername.innerHTML = "Placeholder Username";
    tbUserEmailAddress.innerHTML = "Placeholder Email";
    imgUserProfilePicture.src = "../images/touch/icon-128x128.png";
    // clear data
    elRanking.clearData();
    elGroceryList.clearData();
    // Hide Menu Items
    Util.toggleMenuItems([
      menuItemLogin, menuItemHome, menuItemRecipe,
      menuItemInventory, menuItemProfile
    ]);
    // delete all data in local storage
    UserInfo.deleteAllItems();
    // reset UserId and ExpireDate for Subelements
    app.userlogin = UserInfo.getUserLogin();
    // go to login element
    page.show("/");
  };
  /**
   * END: handle custom events for socobo elements here
   */

  /**
   * show toast after caching is completed
   */
  app.displayInstalledToast = function() {
    document.querySelector("#caching-complete").show();
  };
}(document));
