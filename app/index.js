var yeoman = require('yeoman-generator'),
    path = require('path'),
    changeCase = require('change-case'),
    doT = require('dot'),
    fs = require('fs'),
    shell = require('shelljs'),
    slugs = require('slugs'),
    util = require('util');

module.exports = exports = yeoman.generators.Base.extend({

  constructor: function() {
    yeoman.generators.Base.apply(this, arguments);

    this.on('end', function() {
      this.installDependencies();
    });

    this.pkg = require(__dirname + '/../package.json');
  },

  promptTask: function() {
    var done = this.async();
    this.prompt({
      type: 'input',
      name: 'name',
      message: 'Enter project name:',
      default: this.appname
    }, function(answers) {
      this.appname = slugs(answers.name);
      done();
    }.bind(this));
  },

  buildAppTask: function() {
    var done = this.async();
    this.log.write().info('Start building app.');
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
    this.mkdir('app/views/layouts');
    this.mkdir('app/views/pages');
    this.mkdir('app/views/partials');

    var tmpl = doT.template(fs.readFileSync(__dirname + '/templates/config/databaseConfig.js'));

    this.template('classes/Database.js', 'app/classes/Database.js');
    this.template('config/index.js', 'app/config/index.js');
    this.write('app/config/development/database.js', tmpl({
      appname: changeCase.snakeCase(this.appname),
      environment: 'ddb'
    }));
    this.write('app/config/staging/database.js', tmpl({
      appname: changeCase.snakeCase(this.appname),
      environment: 'sdb'
    }));
    this.write('app/config/production/database.js', tmpl({
      appname: changeCase.snakeCase(this.appname),
      environment: 'pdb'
    }));

    var tmpl = doT.template(fs.readFileSync(__dirname + '/templates/newrelic.js'));

    this.write('app/newrelic.js', tmpl({
      appname: this.appname
    }));

    var gulp = fs.readFileSync(__dirname + '/templates/gulpfile.js');
    gulp = gulp.toString().replace('{{=it.appname}}', changeCase.camelCase(this.appname) + 'App');
    this.write('gulpfile.js', gulp);

    this.template('i18n/index.js', 'app/i18n/index.js');
    this.template('i18n/en/validations.js', 'app/i18n/en/validations.js');
    this.template('libs/constants.js', 'app/libs/constants.js');
    this.template('libs/types.js', 'app/libs/types.js');
    this.template('libs/validations.js', 'app/libs/validations.js');
    this.template('libs/helpers.js', 'app/libs/helpers.js');
    this.template('middlewares/cors.js', 'app/middlewares/cors.js');
    this.template('middlewares/expects.js', 'app/middlewares/expects.js');
    this.template('middlewares/phantom.js', 'app/middlewares/phantom.js');
    this.template('middlewares/jade.js', 'app/middlewares/jade.js');
    this.template('controllers/PagesController.js', 'app/controllers/PagesController.js');
    this.template('views/layouts/default.jade', 'app/views/layouts/default.jade');
    this.template('views/pages/index.jade', 'app/views/pages/index.jade');
    this.template('views/partials/livereload.jade', 'app/views/partials/livereload.jade');

    this.template('index.js', 'app/index.js');
    this.template('routes.js', 'app/routes.js');

    this.directory('public');

    this.mkdir('public/sass');
    this.template('main.scss', 'public/sass/main.scss');
    this.mkdir('public/sass/modules');
    this.mkdir('public/sass/import');
    this.mkdir('public/js');
    this.mkdir('public/img');

    this.template('gitignore', '.gitignore');
    this.template('config/appConfig.js', 'app/config/development/app.js');
    this.template('config/appConfig.js', 'app/config/staging/app.js');
    this.template('config/appConfig.js', 'app/config/production/app.js');

    this.log.write().info('Finished building app.');

    done();
  },

  buildBower: function() {
    var bowerJson = {
      name: this.appname,
      version: "0.0.0",
      authors: [
        'NoProtocol <info@noprotocol.nl>'
      ],
      license: "MIT",
      private: true,
      ignore: [
        "**/.*",
        "node_modules",
        "bower_components",
        "test",
        "tests"
      ],
      dependencies: {
        "bower-bourbon": "*",
        "angular": "*"
      }
    };

    this.write('bower.json', JSON.stringify(bowerJson, null, 2));
  },

  bowerRc: function() {
    var bowerRc = {
      "directory": "public/libs"
    };

    this.write('.bowerrc', JSON.stringify(bowerRc, null, 2));
  },

  npmPackages: function() {
    var packageJson = {
      name: this.appname,
      version: '0.0.0',
      main: 'index.js',
      author: 'NoProtocol <info@noprotocol.nl>',
      license: 'ISC',
      scripts: {
        "start": "node app/index.js",
        "postinstall": "bower install && gulp deploy"
      },
      dependencies: {
        "body-parser": "*",
        "bower": "*",
        "connect-multiparty": "*",
        "cookie-parser": "*",
        "dot": "*",
        "ejs": "*",
        "express": "*",
        "jade": "*",
        "morgan": "*",
        "newrelic": "*",
        "phantom": "*",
        "phantomjs": "*",
        "q": "*",
        "sugar": "*",
        "mongoose": "*"
      },
      devDependencies: {
        "gulp": "*",
        "gulp-livereload": "*",
        "gulp-noprotocol": "*"
      }
    };

    this.write('package.json', JSON.stringify(packageJson, null, 2));
  }

});