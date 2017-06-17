var azure = require('azure-storage');
var http = require('http');
var log4js = require('log4js');
var formidable = require('formidable');
var fs = require('fs');

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
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
		res.write('<input type="file" name="filetoupload"><br>');
		res.write('<input type="submit">');
		res.write('</form>');
		return res.end();
	}
	if (req.url == '/fileupload') {
		var form = new formidable.IncomingForm();
		form.parse(req, function (err, fields, files) {
			var oldpath = files.filetoupload.path;
			var newpath = '/' + files.filetoupload.name;
			fs.rename(oldpath, newpath, function (err) {
				if (err) throw err;
				res.write('File uploaded and moved!');
				return res.end();
			});
		});
	}
	
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end('Hello World\n');
}).listen(port);