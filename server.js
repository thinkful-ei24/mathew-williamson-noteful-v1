'use strict';

const express = require('express');
const morgan = require('morgan');
const config = require('./config');

// Load array of notes
const notesRouter = require('./router/notes.router');


const app = express(); 

app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.json());

app.use('/api/notes', notesRouter)

app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  res.status(404).json( { message: 'Not Found' });
  next();
});

app.use( function(err, req, res, next) {
  res.status( err.status || 500);
  res.json( {
    message: err.message,
    error: err
  });
});

app.listen(config.PORT, function() {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
});