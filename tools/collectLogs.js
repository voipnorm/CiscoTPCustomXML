//download logs from a endpoint

require('dotenv').config();
const request = require('request');
const fs = require('fs');
const username = process.env.TPADMIN || "admin";
const password = process.env.TPADMINPWD || "password";

module.exports = {
    collectLogs : function(ip) {
        return new Promise(function (resolve) {
            const url = `http://${ip}/api/logs/download`;
            const r = request.get(url).auth(username, password, false);
            r.on('response', function (res) {
                res.pipe(fs.createWriteStream('./endpointLogs/' + res.headers.date + '.' + res.headers['content-type'].split('/')[1]))
                res.on('end', function() { resolve("write complete") });
            })
        })
    }
}

