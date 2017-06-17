var azure = require('azure-storage');
var http = require('http');
var log4js = require('log4js');
var FormData = require('form-data');

var form = new FormData();

log4js.loadAppender('file');
log4js.addAppender(log4js.appenders.file('knightapi.log'), 'knightlogger');
var logger = log4js.getLogger('knightlogger');
logger.setLevel('DEBUG');
logger.info('Logging setup successfully.');

/*var tableSvc = azure.createTableService();
tableSvc.createTableIfNotExists('knightapi', function(error, result, response){
  if(!error){
	  //logger.info('Table creation not required, table has already been created.');
  } else {
	  //logger.info('New table called knightapi has been created.');
  }
});*/

var port = process.env.port || 1337;
http.createServer(function (req, res) {
	if (req.url == "/api") {
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.writeHead(200, { 'Content-Type': 'application/json' });
		res.end(JSON.stringify({ quoteMon: "To be or not to be", quoteTues: 1, quoteWed: 1, quoteThurs: 1, quoteFri: 1, quoteSat: 1, quoteSun: 1 }, null, 3));
		return;
	}
	if (req.url == "/form") {
		form.append('my_field', 'my value');
		return;
	}
	
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end('Hello World\n');
}).listen(port);

function displayForm(res) {
    fs.readFile('form.html', function (err, text) {
        res.setHeader("Content-Type", "text/html");
        res.end(text);
    });
};