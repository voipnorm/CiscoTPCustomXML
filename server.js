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
        log.info("Encoding images to base64 for deployment.... ");
        return image64.base64encode(files);
    })
    .then((fileString) => {
        //log.info(fileString[1]);
        filePath = fileString;
        return excel.readcsv()
    })
    .then((endpoints) => {
        log.info("Processing branding xml to create new xml file......");
        endpointArray = endpoints;
        return buildXml.brandingXml(filePath);
    })
    .then((xmlReturn) => {
        log.info("XML deployment starting........ ");
         xmlString = xmlReturn;
         _.forEach(endpointArray, function(endpoint){
             if(!endpoint) return log.info("Blank endpoint, no files deployed.");
             tpXml.setBranding(endpoint,xmlString, function(err,responseText){
                 if(err){return log.error("failed to deliver package either not supported or not online endpoint : "+endpoint)}
                 log.info("Deployed package to :"+endpoint)
             });

         })
    })
    .catch(err => {
        log.error(err);
    })

