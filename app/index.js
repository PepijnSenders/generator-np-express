var yeoman = require('yeoman-generator'),
    path = require('path'),
    changeCase = require('change-case'),
    doT = require('dot'),
    fs = require('fs'),
    util = require('util');

module.exports = exports = yeoman.generators.Base.extend({

  constructor: function() {
    yeoman.generators.Base.apply(this, arguments);

    this.pkg = require(__dirname + '/../package.json');
  },

  npmPackages: function() {
    var packageJson = {
      name: this.appname,
      version: '0.0.0',
      main: 'index.js',
      author: 'NoProtocol <info@noprotocol.nl>',
      license: 'ISC',
      dependencies: {
        'express': '*',
        'q': '*',
        'mongoose': '*',
        'sugar': '*',
        'ejs': '*',
        'morgan': '*',
        'body-parser': '*',
        'dot': '*'
      }
    };

    this.write('package.json', JSON.stringify(packageJson, null, 2));
  },

  promptTask: function() {
    var done = this.async();
    this.prompt({
      type: 'input',
      name: 'name',
      message: 'Enter project name:',
      default: this.appname
    }, function(answers) {
      this.appname = answers.name;
      done();
    }.bind(this));
  },

  buildAppTask: function() {
    this.log('Start building app.');
    this.directory('app');
    this.mkdir('app/classes');
    this.mkdir('app/config');
    this.mkdir('app/config/development');
    this.mkdir('app/config/staging');
    this.mkdir('app/config/production');
    this.mkdir('app/controllers');
    this.mkdir('app/i18n');
    this.mkdir('app/i18n/en');
    this.mkdir('app/libs');
    this.mkdir('app/middlewares');
    this.mkdir('app/models');
    this.mkdir('app/views');

    var tmpl = doT.template(fs.readFileSync(__dirname + '/templates/config/databaseConfig.js'));

    this.template('classes/Database.js', 'app/classes/Database.js');
    this.template('config/index.js', 'app/config/index.js');
    this.write('app/config/development/database.js', tmpl({
      appname: this.appname,
      environment: 'ddb'
    }));
    this.write('app/config/staging/database.js', tmpl({
      appname: this.appname,
      environment: 'sdb'
    }));
    this.write('app/config/production/database.js', tmpl({
      appname: this.appname,
      environment: 'pdb'
    }));

    this.template('i18n/index.js', 'app/i18n/index.js');
    this.template('i18n/en/validations.js', 'app/i18n/en/validations.js');
    this.template('libs/constants.js', 'app/libs/constants.js');
    this.template('libs/types.js', 'app/libs/types.js');
    this.template('libs/validations.js', 'app/libs/validations.js');
    this.template('middlewares/cors.js', 'app/middlewares/cors.js');
    this.template('middlewares/expects.js', 'app/middlewares/expects.js');
    this.template('controllers/HomeController.js', 'app/controllers/HomeController.js');

    this.template('index.js', 'app/index.js');
    this.template('routes.js', 'app/routes.js');

    this.mkdir('public');

    this.template('gitignore', '.gitignore');
    this.template('config/appConfig.js', 'app/config/development/app.js');
    this.template('config/appConfig.js', 'app/config/staging/app.js');
    this.template('config/appConfig.js', 'app/config/production/app.js');

    this.template('startup.sh', 'startup.sh');
  }

});