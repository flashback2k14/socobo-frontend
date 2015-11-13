var UserInfo = (function() {
  /**
   * Baseurl to Firebase DB
   * @private
   */
  var _baseUrl = "";
  /**
   * local storage keys
   */
  var USEROBJECT = "Socobo.UserObj";
  var USERID = "Socobo.Id";
  var EXPIREDATE = "Socobo.ExpireDate";
  var USERNAME = "Socobo.Username";
  var EMAILADDRESS = "Socobo.EmailAddress";
  var PROFILEIMAGE = "Socobo.ProfileImage";
  /**
   * init UserInfo
   * @param baseurl
   */
  function init(baseurl) {
    _baseUrl = baseurl;
  }
  /**
   * set user info to local storage
   * @param key
   * @param value
   */
  function set(key, value) {
    window.localStorage.setItem(key, value);
  }
  /**
   * get user info from local storage
   * @param key
   * @return {String, Number, Object}
   */
  function get(key) {
    return window.localStorage.getItem(key);
  }
  /**
   * remove specific user info from local storage
   * @param key
   */
  function deleteItem(key) {
    window.localStorage.removeItem(key);
  }
  /**
   * remove all user infos from local storage
   */
  function deleteAllItems() {
    deleteItem(USEROBJECT);
    deleteItem(USERID);
    deleteItem(EXPIREDATE);
    deleteItem(USERNAME);
    deleteItem(EMAILADDRESS);
    deleteItem(PROFILEIMAGE);
  }
  /**
   * Return Firebase Base URL
   * @return {String}
   */
  function getBaseUrl() {
    return _baseUrl;
  }
  /**
   * Return User Information for Subelements
   * @return {Object}
   */
  function getUserLogin() {
    var obj = {};
    obj.firebaseUrl = _baseUrl;
    obj.userId = get(USERID);
    obj.expires = get(EXPIREDATE);
    return obj;
  }
  /**
   * make const variables and functions public
   */
  return {
    USEROBJECT    : USEROBJECT,
    USERID        : USERID,
    EXPIREDATE    : EXPIREDATE,
    USERNAME      : USERNAME,
    EMAILADDRESS  : EMAILADDRESS,
    PROFILEIMAGE  : PROFILEIMAGE,
    init            : init,
    set             : set,
    get             : get,
    deleteItem      : deleteItem,
    deleteAllItems  : deleteAllItems,
    getUserLogin    : getUserLogin,
    getBaseUrl      : getBaseUrl
  };
})();
