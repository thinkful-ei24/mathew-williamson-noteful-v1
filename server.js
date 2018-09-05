'use strict';

const express = require('express');
const config = require('./config');
const logger = require('./middleware/logger');

// Load array of notes
const data = require('./db/notes');
const simDB = require('./db/simDB');
const notes = simDB.initialize(data);

const app = express(); 


const getItemID = function(req) {
  return Number(req.params.id);
};

const generateResponse = function(res, jsonObj) {
  res.json(jsonObj);
};

const filterBySearchTerm = function(searchQuery) {
  return data.filter(item => item.title.includes(searchQuery.searchTerm) || item.content.includes(searchQuery.searchTerm));
}

//Get Stuff
app.get('*', (req, res, next) => {
  console.log(logger.logger(req));
  next();
})

app.get('/api/notes', (req, res) => {
  const searchQuery = req.query;

  if (searchQuery.searchTerm) {
    let searchedItems = filterBySearchTerm(searchQuery);
    generateResponse(res, searchedItems);

  }
  generateResponse(res, data);
  return;
});

app.get('/api/notes/:id', (req, res) => {
  generateResponse(res, data.find(item => item.id === getItemID(req)));
  return;
});

app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  res.status(404).json( { message: 'Not Found' });
  next();
})

app.use( function(err, req, res, next) {
  res.status( err.status || 500);
  res.json( {
    message: err.message,
    error: err
  })
})

app.listen(config.PORT, function() {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});