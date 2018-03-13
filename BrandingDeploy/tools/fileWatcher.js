const fs = require('fs');
const _ = require('lodash');
const log = require('../svrConfig/logger');

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
                    log.info("Finished reading directoies");
                    return resolve(dirString);
                }
            }




        })
    }
}

