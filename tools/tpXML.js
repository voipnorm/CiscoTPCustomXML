require('dotenv').config();
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xmlHttp = new XMLHttpRequest();
const log = require('../svrConfig/logger');

module.exports = {
    setBranding: function(ip, xml, cb){
        var password = process.env.TPADMINPWD;
        var username = process.env.TPADMIN;
        if(!ip){return log.error("No ip found")}
        var url = `http://${ip}/putxml`;
        log.info(url);
        //log.info(xml);
        var mimeType = "text/xml";

            xmlHttp.onreadystatechange = function() {

                if (xmlHttp.readyState === 4) {
                    log.info("State: " + this.readyState);


                    if (this.readyState === 4) {
                        log.info(null,"Complete.\nBody length: " + this.responseText.length);
                        log.info("Body:\n" + this.responseText+xmlHttp.DONE);
                        if(xmlHttp.DONE === 4) {cb(null,this.responseText)};
                    }

                }
            }
            xmlHttp.open('POST', url, true, username, password);
            xmlHttp.setRequestHeader('Content-Type', mimeType);
            xmlHttp.withCredentials = true;
            xmlHttp.send(xml);
        }

}




