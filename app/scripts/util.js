var Util = (function() {
  /**
   * helper for saving object in localStorage
   * @param value
   * @return {String}
   */
  var objectToString = function(value) {
    return JSON.stringify(value);
  };
  /**
   * helper to parse localStorage string to object
   * @param value
   * @return {Object}
   */
  var stringToObject = function(value) {
    return JSON.parse(value);
  };
  /**
   * get current timestamp
   * @return {number}
   * @private
   */
  var _getCurrentTimestamp = function() {
    return Math.round(new Date().getTime() / 1000.0);
  };
  /**
   * check if user login is expired
   * @param expireDate
   * @return {boolean}
   */
  var isUserLoginExpired = function(expireDate) {
	  return expireDate === null || _getCurrentTimestamp() >= expireDate;
  };
  /**
   * toggle single Menu Item
   * @param mItem
   * @private
   */
  var _toggleMI = function(mItem) {
    if (mItem.classList.contains('show-menu-item')) {
      mItem.classList.remove('show-menu-item');
      mItem.classList.add('hide-menu-item');
    } else {
      mItem.classList.remove('hide-menu-item');
      mItem.classList.add('show-menu-item');
    }
  };
  /**
   * toggle all Menu Items
   * @param menuItems
   */
  var toggleMenuItems = function(menuItems) {
    menuItems.forEach(function(menuItem) {
      _toggleMI(menuItem);
    });
  };
  /**
   * show info toast
   * @param toast
   * @param text
   * @param bgColor
   * @param color
   */
  var showToast = function(toast, text, bgColor, color) {
    toast.text = text;
    toast.style.background = bgColor;
    toast.style.color = color;
    toast.show();
  };

  /**
   * make functions public
   */
  return {
    objectToString      : objectToString,
    stringToObject      : stringToObject,
    isUserLoginExpired  : isUserLoginExpired,
    toggleMenuItems     : toggleMenuItems,
    showToast           : showToast
  };
})();
