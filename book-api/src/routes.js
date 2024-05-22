// src/routes.js
const express = require('express');
const { check } = require('express-validator');
const {
  register,
  login,
  verifyToken,
  authorizeRoles,
  createBook,
  getBooks,
  updateBook,
  deleteBook,
  upload
} = require('./controllers');

const router = express.Router();

router.post('/register', [
  check('username').isLength({ min: 3 }),
  check('password').isLength({ min: 6 }),
  check('role').isIn(['Admin', 'Author', 'Reader'])
], register);

router.post('/login', [
  check('username').exists(),
  check('password').exists()
], login);

router.post('/books', verifyToken, authorizeRoles('Admin', 'Author'), upload.single('coverPage'), [
  check('title').notEmpty(),
  check('author').notEmpty(),
  check('year').isInt()
], createBook);

router.get('/books', verifyToken, authorizeRoles('Admin', 'Author', 'Reader'), getBooks);

router.put('/books/:id', verifyToken, authorizeRoles('Admin', 'Author'), [
  check('title').notEmpty(),
  check('author').notEmpty(),
  check('year').isInt()
], updateBook);

router.delete('/books/:id', verifyToken, authorizeRoles('Admin'), deleteBook);

module.exports = router;





