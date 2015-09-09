var Util = (function() {
  /**
   * helper for saving object in localStorage
   * @param value
   * @return {String}
   */
  function objectToString(value) {
    return JSON.stringify(value);
  }
  /**
   * helper to parse localStorage string to object
   * @param value
   * @return {Object}
   */
  function stringToObject(value) {
    return JSON.parse(value);
  }
  /**
   * get current timestamp
   * @return {number}
   * @private
   */
  function _getCurrentTimestamp() {
    return Math.round(new Date().getTime() / 1000.0);
  }
  /**
   * check if user login is expired
   * @param expireDate
   * @return {boolean}
   */
  function isUserLoginExpired(expireDate) {
	  return expireDate === null || _getCurrentTimestamp() >= expireDate;
  }
  /**
   * util function to extract the user name from the emailaddress
   * @param email
   * @returns {String}
   */
  function getUsernameFromMailAddress(email) {
    return email.split("@")[0];
  }
  /**
   * get email address from social provider
   * @param userObj
   * @return {String}
   */
  function getEmailAddressFromSocialProvider(userObj) {
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
  /**
   * make functions public
   */
  return {
    objectToString                    : objectToString,
    stringToObject                    : stringToObject,
    isUserLoginExpired                : isUserLoginExpired,
    getUsernameFromMailAddress        : getUsernameFromMailAddress,
    getEmailAddressFromSocialProvider : getEmailAddressFromSocialProvider
  };
})();
