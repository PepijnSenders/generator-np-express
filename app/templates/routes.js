var HomeController = require(global.APP_DIR + '/controllers/HomeController');

/**
 * @class  Routes
 * @type   {Function}
 * @param  {Express.app} app
 */
module.exports = exports = function(app) {
  req.get('/', HomeController.hello);
};