//Application Entry. Command line inut processed by switch command and launches the right function called.

const log = require('./svrConfig/logger');
const comms = require('./svrConfig/comFunct');



switch (process.argv[2]) {
    case null:
        log.info("Command incomplete");
        return log.info("Please specify your operation. Node command incomplete. Refer to readme for more instructions.");
    case "bundle":
        log.info("Deploying bundle");
        return comms.bundle();
    case 'branding':
        log.info("Deploy Branding");
        return comms.branding();
    case 'logs':
        log.info("Deploy log collection.");
        return comms.logCollection(process.argv[3]);
    default:
        log.info("Command incomplete");
        return log.info("Please specify your operation. Node command incomplete. Refer to readme for more instructions.");
}
