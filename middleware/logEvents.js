const { format } = require('date-fns');
const { v4: uuid } = require('uuid');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const logEvents = async (message, logName) => {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`; // date formating
    const logItem = `${dateTime}\t${uuid()}\t ${message}\n`; // log event item
    console.log(logItem)
    try {
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs')) // check if the directory exists if not make a new one
        }
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logName), logItem); // append the log item to the directory

    } catch (err) {
        console.error(err)
    }
}

const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt');// log the request method, origin and url
    console.log(`${req.method} ${req.path}`);
    next();
};

module.exports = { logEvents, logger };
