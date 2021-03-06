'use strict';

const express = require('express');
const config = require('./config');
const logger = require('./middleware/logger');

// Load array of notes
const data = require('./db/notes');
const simDB = require('./db/simDB');
const notes = simDB.initialize(data);

const app = express(); 

app.use(logger);
app.use(express.static('public'));
app.use(express.json());


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
// app.get('*', (req, res, next) => {
//   console.log(logger.logger(req));
//   next();
// })

app.put('/api/notes/:id', (req, res, next) =>{
  const id = req.params.id;

  /*** never trust users, always validate input */
  const updateObj = [];
  const updateFields = ['title', 'content'];

  console.log(req.body)

  updateFields.forEach( field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });
  console.log(updateObj)

  notes.update(id, updateObj, (err, item) => {
    if (err) {
      return next(err);
    }
    if (item) {
      res.json(item);
    } else {
      next();
    }
  });
});

app.get('/api/notes', (req, res, next) => {
  const { searchTerm } = req.query;

  notes.filter(searchTerm, (err, list) => {
    if (err) {
      return next(err);
    }
    res.json(list);
  });
});

app.get('/api/notes/:id', (req, res, next) => {
  notes.find(req.params.id, (err, list) => {
    if (err) {
      return next(err);
    }
    res.json(list);
  });
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