//application/zip, application/x-zip-compressed

const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const log = require('./logger');
// you can pass the parameter in the command line. e.g. node static_server.js 3000
const port = process.env.PORT || 9000;
http.createServer(function (req, res) {
    log.info(`${req.method} ${req.url}`);
    // parse URL
    const parsedUrl = url.parse(req.url);
    // extract URL path
    let pathname = `.${parsedUrl.pathname}`;
    // maps file extention to MIME types
    const mimeType = {
        '.zip': 'application/zip'
    };
    fs.exists(pathname, function (exist) {
        if(!exist) {
            // if the file is not found, return 404
            res.statusCode = 404;
            res.end(`File ${pathname} not found!`);
            return;
        }
        // if is a directory, then look for index.html
        if (fs.statSync(pathname).isDirectory()) {
            pathname += '/xmlFiles/backupBundle/backup-bundle.zip';
        }
        // read file from file system
        fs.readFile(pathname, function(err, data){
            if(err){
                res.statusCode = 500;
                res.end(`Error getting the file: ${err}.`);
            } else {
                // based on the URL path, extract the file extention. e.g. .js, .doc, ...
                const ext = path.parse(pathname).ext;
                // if the file is found, set Content-type and send data
                res.setHeader('Content-type', mimeType[ext] || 'text/plain' );
                res.end(data);
            }
        });
    });
}).listen(parseInt(port));
log.info(`Server listening on port ${port}`);