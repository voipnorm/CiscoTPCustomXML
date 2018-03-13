//module for reading CSV file downloaded from Spark for uploading bulk TP endpoints - needs work on adding validy of CSV format

var Excel = require('exceljs');
var fs = require('fs');
var workbook = new Excel.Workbook();
var log = require('../svrConfig/logger');




module.exports = {
    readcsv: function(){
        return new Promise(function(resolve, reject){
            var endpoints = [];
            var filename;
            var fileDir = './endpoints/';
            var file = fs.readdirSync(fileDir);
                log.info(file);
                filename = fileDir+file;

            log.info("reading CSV")

            workbook.csv.readFile(filename)
                .then(function(worksheet) {

                    for(var i = 0; i<worksheet.actualRowCount+1; i++){
                        var row = worksheet.getRow(i+1).values;
                        row = row.toString().replace(/,/g,'');
                        log.info(row);
                        endpoints.push(row);

                    }
                    resolve(endpoints);
                }).catch(function(err){
                    reject(err);
            })

        })
    }
};

