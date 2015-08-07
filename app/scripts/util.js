var Util = {
  /**
   * util function to extract the user name from the emailaddress
   * @param email
   * @returns {String}
   */
  getUsernameFromMailAddress: function(email) {
    return email.split("@")[0];
  }
};
