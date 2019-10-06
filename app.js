'use strict';

var dbmanager = require('./routes/db-manager');
var mailmanager = require('./routes/mail-manager');
var mailConf = require('./config/mailconf.json');
var appconf = require('./config/appconf.json');


var getDelayedObjects = dbmanager.getDelayedObjects;

setInterval(() => {
    getDelayedObjects().then((delayedObjectsCount) => {
        if (delayedObjectsCount > 0) {
            console.log(`Delayed record found.  ${delayedObjectsCount}`);
            var emailBodyText = `Delayed no of record(s) : ${delayedObjectsCount}`;

            console.log("Sending Email");
            mailmanager.sendDelayedMail(mailConf.to, mailConf.subject, emailBodyText);
        } else {
            console.log("No delayed record found.");
        }

    });
}, appconf.mailSendInterval);


