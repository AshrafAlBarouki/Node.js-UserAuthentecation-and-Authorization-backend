const {logEvents} = require('./logEvents');

const errHandler = (err,req,res,next)=>{
    logEvents(`${err.name}: ${err.message}`,'errLog.txt'); // log the error name and message into a new file in logs directory
    console.log(err.stack);
    res.status(500).send(err.message);
}

module.exports = errHandler;