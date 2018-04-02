//creates main endpoint object for TP endpoint
/*
 multipart/form-data
 */

require('dotenv').config();
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

const util = require('util');
const EventEmitter = require('events').EventEmitter;
const TpXapi = require('./tpXapi');
const log = require('../svrConfig/logger');
const request = require('request');
const fs = require('fs');

//pass in object versus single values
function Endpoint(ip,xml,type){
    this.ipAddress = ip;
    this.password = process.env.TPADMINPWD;
    this.username = process.env.TPADMIN;
    this.url = `http://${ip}/putxml`;
    this.wallpaperUrl = `http://${ip}/api/wallpapers`;
    this.version = '';
    this.xml = xml;
    this.type = type;
    this.init();
}

util.inherits(Endpoint,EventEmitter);

Endpoint.prototype.init = function(){
    var self = this;
//insert version checker to work out best thing to deploy. Should check version for back-bundles as well.
    self.firmwareCheck()
        .then((data) => {
            var version = data.slice(2,7);
            log.info(version);
            if(self.type==="branding"){
                switch (true) {
                    case (/(^)9.3( |.|$)/).test(version):
                        return self.deployXml();
                    case (/(^)9.2( |.|$)/).test(version):
                        return self.deployXml();
                    case (/(^)9.1( |.|$)/).test(version):
                        return self.postWallpaper();
                    case (/(^)7( |.|$)/).test(version):
                        return self.postWallpaper();
                    default:
                        return log.info("Something went wrong with firmware check");
                }
            }else if(self.type==="wallpaper"){
                return self.postWallpaper();
            }else{
                switch (true) {
                    case (/(^)9.3( |.|$)/).test(version):
                        return self.deployXml();
                    default:
                        return log.info("Endpoint not compatible with bundling feature. Must be CE9.3 or later: " +self.ipAdress+' : '+self.version);
                }
            }

        })
        .catch(err => {
            log.error(err);
        })

};
//check what version of software is on the endpoint
Endpoint.prototype.firmwareCheck = function (){
    var self = this;
    return new Promise(function(resolve){
        log.info("firmwareCheck launched ...");

        var ep = {
            "password": self.password,
            "username": self.username,
            "ipAddress" : self.ipAddress
        };
        var videoCodec = new TpXapi(ep);
        videoCodec.getEndpointData()
            .then((version) => {
            return resolve(version);
            })
            .catch(err => {
                log.error(err);
            });


    })

};

Endpoint.prototype.deployXml =  function(){
    var self = this;
    var mimeType = "text/xml";
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {

        if (xmlHttp.readyState === 4) {
            log.info("State: " + this.readyState);


            if (this.readyState === 4) {
                log.info(null,"Complete.\nBody length: " + this.responseText.length);
                log.info("Body:\n" + this.responseText+xmlHttp.DONE);
                if(xmlHttp.DONE === 4 && this.responseText.length > 1) return log.info("Package Deployed to "+self.ipAddress);
            }

        }
    }
    xmlHttp.open('POST', self.url, true, self.username, self.password);
    xmlHttp.setRequestHeader('Content-Type', mimeType);
    xmlHttp.withCredentials = true;
    xmlHttp.send(this.xml);
};

Endpoint.prototype.postWallpaper = function(){
    log.info("Posting wall paper");
    const self = this;
    const dir = "./img/wallpaper/";
    var fileName = fs.readdirSync('./img/wallpaper/');
    if(!dir) log.error("No file found");
    var fileString = dir+fileName;
    log.info(fileString);
    var formData = {

        file: {
            value:  fs.createReadStream(fileString),
            options: {
                filename: fileName[0],
                contentType: 'image/jpeg'
            }
        }
    };
    log.info(JSON.stringify(formData));
    var r = request.post({url:`http://${self.ipAddress}/api/wallpapers`, formData: formData},function optionalCallback(err, httpResponse, body) {
        if (err) {
            return console.error('upload failed:', err);
        }
        console.log('Upload successful!  Server responded with:', body);
    }).auth(self.username, self.password, false);



};


module.exports = Endpoint;
