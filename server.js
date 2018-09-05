'use strict';

const express = require('express');
const config = require('./config');

// Load array of notes
const data = require('./db/notes');

const app = express(); 

console.log(config.PORT)

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


app.listen(config.PORT, function() {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});