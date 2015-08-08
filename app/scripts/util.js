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
   return expireDate === this._getCurrentTimestamp();
  }
};
