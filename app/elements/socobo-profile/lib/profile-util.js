/* exported ProfileUtil */
var ProfileUtil = (function() {
  /**
   * Instance stores a reference to the Singleton
   */
  var instance;
  /**
   * Socobo Profile Util
   *
   * @returns {{
   *  arePasswordsMatching: arePasswordsMatching, toggleInformationArea: toggleInformationArea,
   *  toggleRightAdminContainerElements: toggleRightAdminContainerElements, isUserLoginExpired: isUserLoginExpired
   * }}
   */
  function init() {
    /**
     * HELPER FUNCTION PASSWORD CHECK
     */
    /**
     * Check if Passwords are matching
     *
     * @param {String} oldPwd old Password
     * @param {RegExp} newPwd new Password
     * @return {Boolean}
     * @private
     */
    function arePasswordsMatching(oldPwd, newPwd) {
      return (oldPwd.length >= 8 && newPwd >= 8) && oldPwd.match(newPwd);
    }
    /**
     * HELPER FUNCTIONS PROFILE SECTION
     */
    /**
     * Check if an Element is shown
     *
     * @param {HTMLElement} element Input Field
     * @return {boolean}
     * @private
     */
    function _isElementShown(element) {
      return element.classList.contains("show-right-admin-container");
    }
    /**
     * Show an Element
     *
     * @param {HTMLElement} element Element
     * @param {String} showCssClass CSS Class to show an Element
     * @param {String} hideCssClass CSS Class to hide an Element
     * @private
     */
    function _showElement(element, showCssClass, hideCssClass) {
      element.classList.remove(hideCssClass);
      element.classList.add(showCssClass);
    }
    /**
     * Hide an Element
     *
     * @param {HTMLElement} element Element
     * @param {String} showCssClass CSS Class to show an Element
     * @param {String} hideCssClass CSS Class to hide an Element
     * @private
     */
    function _hideElement(element, showCssClass, hideCssClass) {
      element.classList.remove(showCssClass);
      element.classList.add(hideCssClass);
    }
    /**
     * Toggle specific Profile Section
     *
     * @param {HTMLElement} element Info Container
     * @param {String} showCssClass CSS Class to show an Element
     * @param {String} hideCssClass CSS Class to hide an Element
     * @param {Object} fab FAB for setting Icon - Polymer FAB Element
     * @private
     */
    function _toggleInformationItem(element, showCssClass, hideCssClass, fab) {
      if (element.classList.contains(showCssClass)) {
        _hideElement(element, showCssClass, hideCssClass);
        fab.set("icon", "create");
      } else {
        _showElement(element, showCssClass, hideCssClass);
        fab.set("icon", "clear");
      }
    }
    /**
     * Toggle specific Profile Section to Edit or Show Information
     *
     * @param {HTMLElement}  showInfoStandard Show Info Div
     * @param {HTMLElement} editInfoStandard Edit Info Div
     * @param {HTMLElement} showInfoBio Show Bio Div
     * @param {HTMLElement} editInfoBio Edit Bio Div
     * @param {Event} e FAB
     * @private
     */
    function toggleInformationArea(showInfoStandard, editInfoStandard, showInfoBio, editInfoBio, e) {
      if (e.currentTarget.id === "fabEditInfoStandard") {
        _toggleInformationItem(showInfoStandard, "show-info", "edit-info", e.currentTarget);
        _toggleInformationItem(editInfoStandard, "show-info", "edit-info", e.currentTarget);
      } else {
        _toggleInformationItem(showInfoBio, "show-info", "edit-info", e.currentTarget);
        _toggleInformationItem(editInfoBio, "show-info", "edit-info", e.currentTarget);
      }
    }
    /**
     * HELPER FUNCTIONS ADMINISTRATION SECTION
     */
    /**
     * Toggle right Admin Container to show specific Input Fields
     *
     * @param {Event} e Button
     * @private
     */
    function toggleRightAdminContainerElements(e) {
      var container = document.querySelector("#rightAdminContainer");
      var iOldEmailAddress = document.querySelector("#txtOldEmailAddress");
      var iNewEmailAddress = document.querySelector("#txtNewEmailAddress");
      var iOldPassword = document.querySelector("#txtOldPassword");
      var iNewPassword = document.querySelector("#txtNewPassword");
      var button = e.currentTarget.id;

      if (container.classList.contains("hide-right-admin-container")) {
        _showElement(container, "show-right-admin-container", "hide-right-admin-container");

        switch (button) {
          case "btnChangeEmailAddress":
            if (!_isElementShown(iOldEmailAddress)) {
              _showElement(iOldEmailAddress, "show-right-admin-container", "hide-right-admin-container");
            }
            if (!_isElementShown(iNewEmailAddress)) {
              _showElement(iNewEmailAddress, "show-right-admin-container", "hide-right-admin-container");
            }
            if (!_isElementShown(iOldPassword)) {
              _showElement(iOldPassword, "show-right-admin-container", "hide-right-admin-container");
            }
            if (_isElementShown(iNewPassword)) {
              _hideElement(iNewPassword, "show-right-admin-container", "hide-right-admin-container");
            }
            return "ChangeEmailAddress";

          case "btnChangePassword":
            if (!_isElementShown(iOldEmailAddress)) {
              _showElement(iOldEmailAddress, "show-right-admin-container", "hide-right-admin-container");
            }
            if (_isElementShown(iNewEmailAddress)) {
              _hideElement(iNewEmailAddress, "show-right-admin-container", "hide-right-admin-container");
            }
            if (!_isElementShown(iOldPassword)) {
              _showElement(iOldPassword, "show-right-admin-container", "hide-right-admin-container");
            }
            if (!_isElementShown(iNewPassword)) {
              _showElement(iNewPassword, "show-right-admin-container", "hide-right-admin-container");
            }
            return "ChangePassword";

          case "btnResetPassword":
            if (!_isElementShown(iOldEmailAddress)) {
              _showElement(iOldEmailAddress, "show-right-admin-container", "hide-right-admin-container");
            }
            if (_isElementShown(iNewEmailAddress)) {
              _hideElement(iNewEmailAddress, "show-right-admin-container", "hide-right-admin-container");
            }
            if (_isElementShown(iOldPassword)) {
              _hideElement(iOldPassword, "show-right-admin-container", "hide-right-admin-container");
            }
            if (_isElementShown(iNewPassword)) {
              _hideElement(iNewPassword, "show-right-admin-container", "hide-right-admin-container");
            }
            return "ResetPassword";

          case "btnDeleteAccount":
            if (!_isElementShown(iOldEmailAddress)) {
              _showElement(iOldEmailAddress, "show-right-admin-container", "hide-right-admin-container");
            }
            if (_isElementShown(iNewEmailAddress)) {
              _hideElement(iNewEmailAddress, "show-right-admin-container", "hide-right-admin-container");
            }
            if (!_isElementShown(iOldPassword)) {
              _showElement(iOldPassword, "show-right-admin-container", "hide-right-admin-container");
            }
            if (_isElementShown(iNewPassword)) {
              _hideElement(iNewPassword, "show-right-admin-container", "hide-right-admin-container");
            }
            return "DeleteAccount";
        }
      } else {
        _hideElement(container, "show-right-admin-container", "hide-right-admin-container");
        return "";
      }
    }
    /**
     * get current timestamp
     *
     * @return {number}
     * @private
     */
    function _getCurrentTimestamp() {
      return Math.round(new Date().getTime() / 1000.0);
    }
    /**
     * check if user login is expired
     *
     * @param {Number} expireDate
     * @return {boolean}
     */
    function isUserLoginExpired(expireDate) {
      return expireDate === null || _getCurrentTimestamp() >= expireDate;
    }
    /**
     * PUBLIC FUNCTIONS
     */
    return {
      arePasswordsMatching: arePasswordsMatching,
      toggleInformationArea: toggleInformationArea,
      toggleRightAdminContainerElements: toggleRightAdminContainerElements,
      isUserLoginExpired: isUserLoginExpired
    };
  }

  return {
    /**
     * Get the Singleton instance if one exist or create one if it doesn't
     *
     * @returns {Object}
     */
    getInstance: function() {
      if (!instance) {
        instance = init();
      }
      return instance;
    }
  };
})();
