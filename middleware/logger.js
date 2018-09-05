'use strict';

function logger(req, res, next) {
  const currentDate = new Date().toLocaleString();
  console.log(`${currentDate} ${req.method} ${req.url}`);
  next()
}

module.exports = logger;