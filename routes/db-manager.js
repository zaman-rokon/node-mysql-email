'use strict';

var mysql = require('mysql');
const formatter = require('dateformat');
const util = require('util');

var dbconf = require('../config/dbconf.json');
var appconf = require('../config/appconf.json')

var mysqlConf = dbconf.mysql;

async function getDelayedObjects() {

    let time = new Date(new Date().toUTCString().slice(0, 19).replace('T', ' '));
    time = formatter(time, "yyyy-mm-dd HH:MM:ss");
    console.log("Current Time" + time)

    let beforeTime = new Date(new Date().toUTCString().slice(0, 19).replace('T', ' '));
    beforeTime.setHours(beforeTime.getHours() - appconf.delayedHours);
    beforeTime = formatter(beforeTime, "yyyy-mm-dd HH:MM:ss");
    console.log("Before time" + beforeTime)

    const queryString = `${mysqlConf.query} where (received_at  between '${beforeTime}' and '${time}' )`;
    console.log("Preparing query to execute ." + queryString);

    try {
        var con = mysql.createConnection(mysqlConf.connectionString);
        if (con != undefined) {
            con.connect(function (err) {
                if (err) {
                    console.log("Error connecting database ..." + err);
                }
                console.log("Database connected!");
            });
            const query = util.promisify(con.query).bind(con);
            const rows = await query(queryString);
            return rows[0].total;
        } else {
            console.log("Mysql connection creation failed: ");
        }
    } catch (err) {
        console.log("Mysql error: " + err);
    } finally {
        if (con != undefined) {
            con.end();
        }
    }
};

module.exports.getDelayedObjects = getDelayedObjects;
