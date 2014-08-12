module.exports = exports = {

  hello: function(req, res) {
    var params = req.expects({
      name: {
        type: 'string',
        validations: 'alphanumeric'
      }
    });

    res.status(200, params);
  }

};