/* exported SocoboGrocery */
var SocoboGrocery = (function() {
  /**
   * Singleton Instance
   */
  var instance;
  /**
   * Init Functions
   *
   * @param {Object} context
   * @param {Object} userLogin
   * @returns {{}}
   * @private
   */
  var _init = function(context, userLogin) {
    // get element
    var _ctx = context;
    // set login data
    var _baseUrl = userLogin.firebaseUrl;
    var _userId = userLogin.userId;
    /**
     * Create Grocery Firebase Path
     *
     * @param {String} section
     * @returns {String}
     * @private
     */
    var _getGroceryItemPath = function(section) {
      return _baseUrl + "grocery/" + _userId + section;
    };
    // specify routes
    var _activeItemsRoute = _getGroceryItemPath("/active");
    var _archiveItemsRoute = _getGroceryItemPath("/archive");
    // declare Firebase refs
    var _refActive = new Firebase(_activeItemsRoute);
    var _refArchive = new Firebase(_archiveItemsRoute);

    /**
     * Handle Errors for changed items
     *
     * @param {Object} err
     * @private
     */
    var _onError = function(err) {
      if (err) {
        _ctx.fire("grocery-changed-error", err);
      }
    };

    /**
     * Register Changed Listener for active Items
     *
     * @private
     */
    var _registerGroceryActiveListeners = function() {
      _refActive.on("child_added", function(snapshot) {
        _ctx.fire("grocery-active-item-added", {key: snapshot.key(), desc: snapshot.val().desc});
      }, _onError);
      _refActive.on("child_removed", function(snapshot) {
        _ctx.fire("grocery-active-item-removed", {key: snapshot.key(), desc: snapshot.val().desc});
      }, _onError);
    };
    /**
     * Register Changed Listener for archive Items
     *
     * @private
     */
    var _registerGroceryArchiveListeners = function() {
      _refArchive.on("child_added", function(snapshot) {
        _ctx.fire("grocery-archive-item-added", {key: snapshot.key(), desc: snapshot.val().desc});
      }, _onError);
    };

    /**
     * Register Changed Listener for active and archive Items
     */
    var registerGroceryItemListeners = function() {
      _registerGroceryActiveListeners();
      _registerGroceryArchiveListeners();
    };
    /**
     * Add Item to active List
     *
     * @param {Object} item
     */
    var addItemToActiveList = function(item) {
      _refActive.push(item, _onError);
    };
    /**
     * Remove Item from active List
     *
     * @param {Object} item
     */
    var removeItemFromActiveList = function(item) {
      var removePath = new Firebase(_activeItemsRoute + "/" + item.key);
      removePath.remove();
    };
    /**
     * Add Item to archive List
     *
     * @param {Object} item
     */
    var addItemToArchiveList = function(item) {
      _refArchive.push(item, _onError);
    };
    /**
     * Remove Item from archive List
     *
     * @param {Object} item
     */
    var removeItemFromArchiveList = function(item) {
      var removePath = new Firebase(_archiveItemsRoute + "/" + item.key);
      removePath.remove();
    };

    /**
     * Public API
     */
    return {
      registerGroceryItemListeners: registerGroceryItemListeners,
      addItemToActiveList: addItemToActiveList,
      removeItemFromActiveList: removeItemFromActiveList,
      addItemToArchiveList: addItemToArchiveList,
      removeItemFromArchiveList: removeItemFromArchiveList
    };
  };

  return {
    /**
     * Get Singleton Instance
     *
     * @param {Object} context
     * @param {Object} userLogin
     * @returns {Object}
     */
    getInstance: function(context, userLogin) {
      if (!instance) {
        instance = _init(context, userLogin);
      }
      return instance;
    }
  };
})();
