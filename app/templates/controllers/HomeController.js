module.exports = exports = {

  hello: function(req, res) {
    var params = req.expects({
      name: {
        type: 'string',
        validations: 'alphaNum'
      }
    });

    res.status(200).send('Hello ' + params.name);
  }

};