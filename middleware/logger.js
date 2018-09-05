'use strict';

function logger(req) {
  const currentDate = new Date().toLocaleString();
  return `${currentDate} ${req.method} ${req.url}`;
}

module.exports = {
  logger,
}