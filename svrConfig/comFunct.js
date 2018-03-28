const buildXml = require('../tools/buildXml');
const excel = require('../tools/excel');
const image64 = require('../tools/image64');
const filewatcher = require('../tools/filewatcher');
const _ = require('lodash');
const log = require('./logger');
const Endpoint =  require('../tools/endpoint');
const ip = require('../tools/ipaddress');
const collect = require('../tools/collectLogs');


var brandingPath = './img/brand/';
var wallPaperPath = './img/wallpaper/';


var port = process.env.PORT || "9000";
var filePath = [];
var deployEndpoints = [];
var endpointArray = [];
var backUpObj ={};

module.exports = {
    bundle: function(){
        /*STEP 1. build http of host URL and create checksum of backup zip file
         STEP 2. Convert CSV of endpoints into array
         STEP 3. Build XML payload and deliver payload to each endpoint
         */
        //URL consists of directory structure and IP address of machine deployed
        ip.getIPAddress()
            .then(ipString => {
                backUpObj.ip = ipString;
                return filewatcher.fileWatcherBackupBundle()
            })
            .then(fileObj => {
                backUpObj.cs = fileObj.checksum;
                backUpObj.dir = fileObj.fileDir;
                return excel.readcsv()
            })
            .then((endpoints) => {
                log.info("Processing branding xml to create new xml file......");
                endpointArray = endpoints;
                var url = `http://${backUpObj.ip}:${port}/${backUpObj.dir}`;
                log.info(url)
                return buildXml.bundleXml(backUpObj.cs,url)
            })
            .then((xmlReturn) => {
                log.info("XML deployment starting........ ");
                _.forEach(endpointArray, function(ip){
                    if(!ip) return log.info("Blank endpoint, no files deployed.");
                    deployEndpoints.push(new Endpoint(ip, xmlReturn));
                })
            })
            .catch(err => {
                log.error(err)
            });
        const httpServer = require('./svrConfig/httpServer');

    },
    branding: function(){
        /*STEP 1. build base 64 string of image and create file location strings strings
         STEP 2. Convert CSV of endpoints into array
         STEP 3. Build XML payload and deliver payload to each endpoint
         */
        log.info("Branding to be deployed.");
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
                return buildXml(filePath);
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

    },
    logCollection: function(ip){
        collect.collectLogs(ip)
            .then((response) => {
                log.info(response);
            })
            .catch((err) => {
                log.error(err);
            })
    }

};