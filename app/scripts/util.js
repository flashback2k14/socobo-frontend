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
   * toggle single Menu Item
   * @param mItem
   * @private
   */
  function _toggleMI(mItem) {
    if (mItem.classList.contains('show-menu-item')) {
      mItem.classList.remove('show-menu-item');
      mItem.classList.add('hide-menu-item');
    } else {
      mItem.classList.remove('hide-menu-item');
      mItem.classList.add('show-menu-item');
    }
  }
  /**
   * toggle all Menu Items
   * @param menuItemLogin
   * @param menuItemRecipe
   * @param menuItemInventory
   * @param menuItemProfile
   */
  function toggleMenuItems(menuItemLogin, menuItemRecipe, menuItemInventory, menuItemProfile) {
    _toggleMI(menuItemLogin);
    _toggleMI(menuItemRecipe);
    _toggleMI(menuItemInventory);
    _toggleMI(menuItemProfile);
  }
  /**
   * show info toast
   * @param toast
   * @param text
   * @param bgColor
   * @param color
   */
  function showToast(toast, text, bgColor, color) {
    toast.text = text;
    toast.style.background = bgColor;
    toast.style.color = color;
    toast.toggle();
  }

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
