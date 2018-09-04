'use strict';

const express = require('express');

// Load array of notes
const data = require('./db/notes');

const app = express(); 

//Get Stuff
app.get('/api/notes', (req, res) => {
  res.json(data);
  return;
})

app.get('/api/notes/:id', (req, res) => {
  res.json(data.find(item => item.id === Number(req.params.id)));
  return;
})


app.listen(8080, function() {
  console.info(`Server listening on ${this.address().port}`);
}).on('error', err => {
  console.error(err);
})