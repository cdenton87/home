var express = require('express');
var app = express();
app.get('/', function(req, res) {
  res.send('Hello Seattle\n');
});
app.listen(port);
console.log('Listening on port 3001...');