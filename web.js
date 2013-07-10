var express = require('express');

var app = express.createServer(express.logger());

app.get('/', function(request, response) {
//  response.send('Hello World2!');

    fs = require("fs");
//    mysting = fs.readFileSync('index.html', 'utf8');

    var mybuffer = fs.readFileSync('index.html');
    var mystring = mybuffer.toString('utf8');
    response.send(mytsring);

});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
