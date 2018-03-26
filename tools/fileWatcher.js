const fs = require('fs');
const _ = require('lodash');
const log = require('../svrConfig/logger');
const crypto = require('crypto');

module.exports = {
    fileWatcher: function(){
        return new Promise(function(resolve, reject) {

            var dir = ['./img/brand/','./img/wallpaper/'];
            var dirString = [];

            for (i = 0; i < dir.length; i++){
                var file = fs.readdirSync(dir[i]);
                var filename = dir[i]+file;
                dirString.push(filename);

                if(dir.length===i+1){
                    log.info("Finished reading directories, moving to next step...");
                    return resolve(dirString);
                }
            }




        })
    },
    fileWatcherXmlCustom: function(){
        return new Promise(function(resolve, reject) {

            var dir = ['./xmlFiles/macros/','./xmlFile/roomControls/'];
            var dirString = [];

            for (i = 0; i < dir.length; i++){
                var file = fs.readdirSync(dir[i]);
                var filename = dir[i]+file;
                dirString.push(filename);

                if(dir.length===i+1){
                    log.info("Finished reading directories, moving to next step...");
                    return resolve(dirString);
                }
            }




        })
    },
    fileWatcherBackupBundle: function(){
        return new Promise(function(resolve, reject) {

            var dir = './xmlFiles/backupBundle/';

            var file = fs.readdirSync(dir);
            if(!dir) reject("No file found");
            var fileString = fs.readFileSync(dir+file);

            var fileChecksum = checksum(fileString,'sha512');
            var returnObject = {
                checksum: fileChecksum,
                fileDir : "xmlFiles/backupBundle/"+file
            }
            resolve(returnObject);
        })
    }
};

function checksum (str, algorithm, encoding) {
    return crypto
        .createHash(algorithm || 'md5')
        .update(str, 'utf8')
        .digest(encoding || 'hex')
};