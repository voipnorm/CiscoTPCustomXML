//Application Entry

const buildXml = require('./tools/buildXml');
const excel = require('./tools/excel');
const image64 = require('./tools/image64');
const tpXml= require('./tools/tpXML');
const filewatcher = require('./tools/filewatcher');
const _ = require('lodash');
const log = require('./svrConfig/logger');

var brandingPath = './img/brand/';
var wallPaperPath = './img/wallpaper/';

/*STEP 1. build base 64 string of image and create file location strings strings
STEP 2. Convert CSV of endpoints into array
STEP 3. Build XML payload and deliver payload to each endpoint
 */

var filePath = [];

var endpointArray = [];
var xmlString;

Promise.resolve()
    .then(() => {
        return filewatcher.fileWatcher();
    })
    .then((files) => {
        log.info("next step encoding ");
        return image64.base64encode(files);
    })
    .then((fileString) => {
        //log.info(fileString[1]);
        filePath = fileString;
        return excel.readcsv()
    })
    .then((endpoints) => {
        log.info("processing branding xml");
        endpointArray = endpoints;
        return buildXml.brandingXml(filePath);
    })
    .then((xmlReturn) => {
        log.info("XML output = ");
         xmlString = xmlReturn;
         _.forEach(endpointArray, function(endpoint){
             log.info("THis endpoint "+endpoint);
             if(!endpoint) return log.info("Blank endpoint");
             tpXml.setBranding(endpoint,xmlString);
             log.info("Deployed package to :"+endpoint)
         })
    })
    .catch(err => {
        log.error("Oh dear"+err);
    })

