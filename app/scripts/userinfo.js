var UserInfo = {
  /**
   * local storage keys
   */
  USEROBJECT: "UserObj",
  USERID: "Id",
  EXPIREDATE: "ExpireDate",
  USERNAME: "Username",
  EMAILADDRESS: "EmailAddress",
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
    window.localStorage.clear();
  }
};
