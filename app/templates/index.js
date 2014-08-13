var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    logger = require('morgan'),
    constants = require(__dirname + '/libs/constants')(),
    routes = require(global.APP_DIR + '/routes'),
    expects = require(global.APP_DIR + '/middlewares/expects'),
    cors = require(global.APP_DIR + '/middlewares/cors'),
    Database = require(global.APP_DIR + '/classes/Database'),
    config = require(global.APP_DIR + '/config');

app.use(logger('dev'));
app.use(bodyParser.json());

app.use(cors);
app.use(expects);

var database = new Database();
database.connect(config.get('database.name'));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('public', global.PUBLIC_DIR);
app.set('showStackError', true);

app.use(express.static(__dirname + '/public'));

app.listen(config.get('app.port'));
console.log('\nListening on port ' + config.get('app.port') + '\nIn environment ' + global.ENV + '\n');

routes(app);

module.exports = exports = app;