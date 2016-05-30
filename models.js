var models = ['user', 'transaction','objects','Feedback'];

  var l = models.length;
  for (var i = 0; i < l; i++) {
    var model = './models/' + models[i];
    require(model)();
  }