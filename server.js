var http = require('http');
var port = process.env.port || 1337;
http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.send(JSON.stringify({ a: 1 }, null, 3));
}).listen(port);