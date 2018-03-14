//Application Entry

const buildXml = require('./tools/buildXml');
const excel = require('./tools/excel');
const image64 = require('./tools/image64');
const filewatcher = require('./tools/filewatcher');
const _ = require('lodash');
const log = require('./svrConfig/logger');
const Endpoint =  require('./tools/endpoint');

var brandingPath = './img/brand/';
var wallPaperPath = './img/wallpaper/';

/*STEP 1. build base 64 string of image and create file location strings strings
STEP 2. Convert CSV of endpoints into array
STEP 3. Build XML payload and deliver payload to each endpoint
 */

var filePath = [];
var deployEndpoints = [];
var endpointArray = [];


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
         _.forEach(endpointArray, function(ip){
             if(!ip) return log.info("Blank endpoint, no files deployed.");
             deployEndpoints.push(new Endpoint(ip, xmlReturn));



         })
    })
    .catch(err => {
        log.error(err);
    })

