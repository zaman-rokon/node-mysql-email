'use strict';

var nodemailer = require('nodemailer');
var mailConf = require('../config/mailconf.json');

const gmailConf = mailConf.gmail;

var mailOptions = {
    from: mailConf.from,
    to: mailConf.to,
    subject: mailConf.subject,
    text: "mailConf.text"
};

var transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    secure: false,
    auth: {
        user: gmailConf.username,
        pass: gmailConf.password
    }
});

function sendDelayedMail(to, subject, text) {
    console.log("Preparing for sending mail. ");
    var mailOptions = {
        from: mailConf.from,
        to: to,
        subject: subject,
        text: text
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log("Email send failed. " + error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports.sendDelayedMail = sendDelayedMail; 