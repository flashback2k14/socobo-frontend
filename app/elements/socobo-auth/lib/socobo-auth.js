var SocoboAuth = (function() {
  /**
   * Instance stores a reference to the Singleton
   */
  var instance;
  /**
   * Public API
   *
   * @returns {Object} {
   *  {registerUserAndLogin: registerUserAndLogin,
   *  loginWithProvider: loginWithProvider,
   *  loginWithEmailaddress: loginWithEmailaddress
   *  }}
   */
  function init() {
    /**
     * create user on firebase
     *
     * @param {String} baseURL
     * @param {Object} userObj
     * @return {Promise}
     * @private
     */
    var _createUser = function(baseURL, userObj) {
      return new Promise(function(resolve, reject) {
        var rootRef = new Firebase(baseURL);
        rootRef.createUser(userObj, function(err, user) {
          if (err) {
            reject(err);
          }
          if (user) {
            resolve(user);
          }
        });
      });
    };
    /**
     * get username from auth data
     *
     * @param {Object} authData
     * @return {String}
     * @private
     */
    var _getUserName = function(authData) {
      switch (authData.provider) {
        case "password":
          return authData.password.email.replace(/@.*/, "");
        case "google":
          return authData.google.displayName;
        case "twitter":
          return authData.twitter.displayName;
        case "facebook":
          return authData.facebook.displayName;
      }
    };
    /**
     * get email address from auth data
     *
     * @param {Object} userObj
     * @return {String}
     * @private
     */
    var _getUserEmailAddress = function(userObj) {
      switch (userObj.provider) {
        case "password":
          return userObj.password.email;
        case "google":
          return userObj.google.hasOwnProperty("email") ?
              userObj.google.email
            : userObj.google.cachedUserProfile.link;
        case "twitter":
          return userObj.twitter.username;
        case "facebook":
          return userObj.facebook.hasOwnProperty("email") ?
              userObj.facebook.email
            : userObj.facebook.cachedUserProfile.email;
      }
    };
    /**
     * get profile image from auth data
     *
     * @param {Object} userObj
     * @return {String}
     * @private
     */
    var _getUserProfileImage = function(userObj) {
      switch (userObj.provider) {
        case "password":
          return userObj.password.profileImageURL;
        case "google":
          return userObj.google.profileImageURL;
        case "twitter":
          return userObj.twitter.profileImageURL;
        case "facebook":
          return userObj.facebook.profileImageURL;
      }
    };
    /**
     * register user on firebase and log user in
     *
     * @param {String} baseURL
     * @param {String} provider
     * @param {Object} userObj
     * @param {Boolean} isAdmin
     * @return {Promise}
     */
    var registerUserAndLogin = function(baseURL, provider, userObj, isAdmin) {
      if (userObj === null) {
        return loginWithProvider(baseURL ,provider, true, isAdmin);
      } else {
        return _createUser(baseURL, userObj)
          .then(function() {
            return loginWithEmailaddress(baseURL ,userObj, true, isAdmin);
          }.bind(this))
          .catch(function(err) {
            return err;
          });
      }
    };
    /**
     * ToDo: Generate API Keys for
     *  - Facebook
     * auth user with social media provider
     *
     * @param {String} baseURL
     * @param {String} provider
     * @param {Boolean} isRegister
     * @param {Boolean} isAdmin
     * @param {Boolean} hasTermsAccepted
     * @return {Promise}
     */
    var loginWithProvider = function(baseURL, provider, isRegister, isAdmin, hasTermsAccepted) {
      return new Promise(function(resolve, reject) {
        var rootRef = new Firebase(baseURL);
        rootRef.authWithOAuthPopup(provider, function(err, user) {
          if (err) {
            reject(err);
          }
          if (user) {
            if (isRegister) {
              rootRef.child("users").child(user.uid).child("administration").set({
                provider: user.provider,
                isAdmin: isAdmin,
                hasTermsAccepted: hasTermsAccepted
              });
              rootRef.child("profiles").child(user.uid).set({
                name: _getUserName(user),
                email: _getUserEmailAddress(user),
                biography: "Please tell us something about you!",
                profileImage: _getUserProfileImage(user),
                provider: user.provider
              });
            }
            resolve(user);
          }
        }.bind(this));
      });
    };
    /**
     * auth user with Email Address
     *
     * @param {String} baseURL
     * @param {Object} userObj
     * @param {Boolean} isRegister
     * @param {Boolean} isAdmin
     * @param {Boolean} hasTermsAccepted
     * @return {Promise}
     */
    var loginWithEmailaddress = function(baseURL, userObj, isRegister, isAdmin, hasTermsAccepted) {
      return new Promise(function(resolve, reject) {
        var rootRef = new Firebase(baseURL);
        rootRef.authWithPassword(userObj, function onAuth(err, user) {
          if (err) {
            reject(err);
          }
          if (user) {
            if (isRegister) {
              rootRef.child("users").child(user.uid).child("administration").set({
                provider: user.provider,
                isAdmin: isAdmin,
                hasTermsAccepted: hasTermsAccepted
              });
              rootRef.child("profiles").child(user.uid).set({
                name: _getUserName(user),
                email: _getUserEmailAddress(user),
                biography: "Please tell us something about you!",
                profileImage: _getUserProfileImage(user),
                provider: user.provider
              });
            }
            resolve(user);
          }
        }.bind(this));
      });
    };
    /**
     * Provide public functions
     */
    return {
      registerUserAndLogin: registerUserAndLogin,
      loginWithProvider: loginWithProvider,
      loginWithEmailaddress: loginWithEmailaddress
    };
  }
  /**
   * Return Singleton Instance
   */
  return {
    /**
     * Get the Singleton instance if one exist or create one if it doesn't
     *
     * @return {Object}
     */
    getInstance: function() {
      if (!instance) {
        instance = init();
      }
      return instance;
    }
  };
})();
