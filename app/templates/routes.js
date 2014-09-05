var PagesController = require(global.APP_DIR + '/controllers/PagesController');

/**
 * @class  Routes
 * @type   {Function}
 * @param  {Express.app} app
 */
module.exports = exports = function(app) {
  app.get('/', PagesController.hello);
};