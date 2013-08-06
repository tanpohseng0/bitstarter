var express = require('express');

var app = express.createServer(express.logger());

app.get('/', function(request, response) {
//  response.send('Hello World2!');

  
//    mysting = fs.readFileSync('index.html', 'utf8');
    
    fs = require("fs");
    var mybuffer = fs.readFileSync("index.html");
    var mystring = mybuffer.toString("utf8");
    response.send(mystring);

});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
