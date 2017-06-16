var http = require('http');
var port = process.env.port || 1337;
http.createServer(function (req, res) {
	 res.setHeader('Access-Control-Allow-Origin', '*');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ quoteMon: "To be or not to be", quoteTues: 1, quoteWed: 1, quoteThurs: 1, quoteFri: 1, quoteSat: 1, quoteSun: 1 }, null, 3));
}).listen(port);