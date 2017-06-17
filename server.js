var azure = require('azure-storage');
var http = require('http');
var log4js = require('log4js');
var formidable = require('formidable');
var fs = require('fs');
var azureTable = require('azure-table-node')

log4js.loadAppender('file');
log4js.addAppender(log4js.appenders.file('knightapi.log'), 'knightlogger');
var logger = log4js.getLogger('knightlogger');
logger.setLevel('DEBUG');
logger.info('Logging setup successfully.');

var blobSvc = azure.createBlobService();
var tableSvc = azure.createTableService();
var client = azureTable.getDefaultClient();

tableSvc.createTableIfNotExists('knightapi', function(error, result, response){
  if(!error){
	  //logger.info('Table creation not required, table has already been created.');
  } else {
	  //logger.info('New table called knightapi has been created.');
  }
});


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
		res.write('<form action="uploadquote" method="post" enctype="multipart/form-data">');
		res.write('Quote: <input type="text" name="quote"><br>');
		res.write('Account: <input type="text" name="account"><br>');
		res.write('Row: <input type="text" name="row"><br>');
		res.write('<input type="submit">');
		res.write('</form>');
		return res.end();
	}
	if (req.url == '/uploadquote') {
		var form = new formidable.IncomingForm();
		form.parse(req, function (err, fields, files) {
			insertDB(fields.account, fields.row, fields.quote);
			res.writeHead(200, {'Content-Type': 'text/plain'});
			/*tableSvc.retrieveEntity('knightapi', fields.account, fields.row, function(error, result, response){
				if(!error){
					// result contains the entity
				}
				res.end(result);
			});*/
			client.queryEntities('knightapi', {
				query: azureTable.Query.create('PartitionKey', '==', fields.account) 
			}, function (err, data, continuation) {
				if (err) {
					res.writeHead(500, { 'Content-Type': 'text/plain' });
					res.write("Got error :-( " + err);
					res.end("");
					return;
				}
				var json = JSON.stringify(data);
				res.writeHead(200, { 'Content-Type': 'text/plain' })
				res.end("Table displayed: " + json);
			});
			res.end('Successfully Updated Quote');
			return res.end();
		});
	}
	/*if (req.url != "/api" || req.url != "/form" || req.url != "/uploadquote") {
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.end('Hello World\n');
	}*/
}).listen(port);

function insertDB(Account, Row, Quote) {
	var task = {
		PartitionKey: {'_':Account},
		RowKey: {'_': Row},
		message: {'_':Quote},
	};
	tableSvc.insertEntity('knightapi',task, function (error, result, response) {
		if(!error){
			// Entity inserted
		}
	});
};