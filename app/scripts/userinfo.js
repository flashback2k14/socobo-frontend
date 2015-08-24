var UserInfo = {
  /**
   * local storage keys
   */
  USEROBJECT: "UserObj",
  USERID: "Id",
  EXPIREDATE: "ExpireDate",
  USERNAME: "Username",
  EMAILADDRESS: "EmailAddress",
  PROFILEIMAGE: "ProfileImage",
  /**
   * set user info to local storage
   * @param key
   * @param value
   */
  set: function(key, value) {
    window.localStorage.setItem(key, value);
  },
  /**
   * get user info from local storage
   * @param key
   * @return {String, Number, Object}
   */
  get: function(key) {
    return window.localStorage.getItem(key);
  },
  /**
   * remove specific user info from local storage
   * @param key
   */
  delete: function(key) {
    window.localStorage.removeItem(key);
  },
  /**
   * remove all user infos from local storage
   */
  deleteAll: function() {
    window.localStorage.removeItem(UserInfo.USEROBJECT);
    window.localStorage.removeItem(UserInfo.USERID);
    window.localStorage.removeItem(UserInfo.EXPIREDATE);
    window.localStorage.removeItem(UserInfo.USERNAME);
    window.localStorage.removeItem(UserInfo.EMAILADDRESS);
    window.localStorage.removeItem(UserInfo.PROFILEIMAGE);
  }
};
