//creates main endpoint object for TP endpoint

require('dotenv').config();
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xmlHttp = new XMLHttpRequest();
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var log = require('../svrConfig/logger');

//pass in object versus single values
function Endpoint(ip,xml){
    this.ipAdress = ip;
    this.password = process.env.TPADMINPWD;
    this.username = process.env.TPADMIN;
    this.url = `http://${ip}/putxml`;
    this.xml = xml;
    this.init();
}

util.inherits(Endpoint,EventEmitter);

Endpoint.prototype.init = function(){
    var self = this;
    self.setBranding();
};

Endpoint.prototype.setBranding =  function(){
    var self = this;
    var mimeType = "text/xml";

    xmlHttp.onreadystatechange = function() {

        if (xmlHttp.readyState === 4) {
            log.info("State: " + this.readyState);


            if (this.readyState === 4) {
                log.info(null,"Complete.\nBody length: " + this.responseText.length);
                log.info("Body:\n" + this.responseText+xmlHttp.DONE);
                if(xmlHttp.DONE === 4 && this.responseText.length > 1) return log.info("Package Deployed to "+self.ipAdress);
            }

        }
    }
    xmlHttp.open('POST', self.url, true, self.username, self.password);
    xmlHttp.setRequestHeader('Content-Type', mimeType);
    xmlHttp.withCredentials = true;
    xmlHttp.send(this.xml);
};

module.exports = Endpoint;
