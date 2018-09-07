'use strict';

const express = require('express');
const router = express.Router();

const data = require('../db/notes');
const simDB = require('../db/simDB');
const notes = simDB.initialize(data);

/* Promises Done */
router.put('/:id', (req, res, next) =>{
  const id = req.params.id;

  /*** never trust users, always validate input */
  const updateObj = [];
  const updateFields = ['title', 'content'];

  console.log(req.body);

  updateFields.forEach( field => {
    if (field in req.body) {
      updateObj[field] = req.body[field];
    }
  });
  console.log(updateObj);

  notes.update(id, updateObj)
    .then( item => {
      if (item) {
        res.json(item);
      } else {
        next();
      }
    })
    .catch( err => {
      return next(err);
    });
});

/* Promises Done */
router.get('/', (req, res, next) => {
  
  const { searchTerm } = req.query;

  notes.filter(searchTerm)
    .then( list => {
      res.json(list);
    })
    .catch( err => {
      return next(err);
    });
});

/* Promises Done */
router.get('/:id', (req, res, next) => {
  notes.find(req.params.id)
    .then( item => {
      if (item) {
        res.json(item);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    })
});

/* Promises Done */
router.delete('/:id', (req, res, next) => {
  notes.delete(req.params.id)
    .then( () => {
      res.status(204).end();
    })
    .catch( err => {
      return next(err);
    });
});

/* Promises Done */
router.post('/', (req, res, next) => {
  const { title, content } = req.body;

  const newItem = { title, content };

  if (!newItem.title) {
    const err = new Error('Missing "title" in request body');
    err.status = 400;
    return next(err);
  }

  notes.create(newItem)
    .then( item => {
      if (item) {
        res.location(`http://${req.headers.host}/notes/${item.id}`).status(201).json(item);
      } else {
        next();
      }
    })
    .catch( err => {
      return next(err);
    });
});
module.exports = router;