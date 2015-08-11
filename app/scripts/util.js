var Util = {
  /**
   * util function to extract the user name from the emailaddress
   * @param email
   * @returns {String}
   */
  getUsernameFromMailAddress: function(email) {
    return email.split("@")[0];
  },
  /**
   * get current timestamp
   * @return {number}
   * @private
   */
  _getCurrentTimestamp: function() {
    return Math.round(new Date().getTime() / 1000.0);
  },
  /**
   * check if user login is expired
   * @param expireDate
   * @return {boolean}
   */
  isUserLoginExpired: function(expireDate) {
    if (expireDate === null) return true;
    else return expireDate === this._getCurrentTimestamp();
  },
  /**
   * helper for saving object in localStorage
   * @param value
   * @return {String}
   */
  objectToString: function(value) {
    return JSON.stringify(value);
  },
  /**
   * helper to parse localStorage string to object
   * @param value
   * @return {Object}
   */
  stringToObject: function(value) {
    return JSON.parse(value);
  },
  /**
   * get email address from social provider
   * @param userObj
   * @return {String}
   */
  getEmailAddressFromSocialProvider: function(userObj) {
    if (userObj.hasOwnProperty("email")) {
      return userObj.email;
    } else if (userObj.cachedUserProfile.hasOwnProperty("link")) {
      return userObj.cachedUserProfile.link;
    } else if (userObj.cachedUserProfile.hasOwnProperty("email")) {
      return userObj.cachedUserProfile.email;
    } else {
      return "";
    }
  }
};
