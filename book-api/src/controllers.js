// src/controllers.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, Book } = require('./models');
const { validationResult } = require('express-validator');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });


const register = async (req, res) => {
    const { username, password, role } = req.body;
    
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

  bcrypt.hash(password, 5, async (err, hash) => {
    const user = new User({ username, password:hash, role });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
            });
        
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};


const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).send('Invalid credentials');
  }
  const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, role: user.role });
  
};

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).send('Access denied');
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).send('Invalid token');
    req.user = decoded;
    next();
  });
};

const authorizeRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).send('Access forbidden');
  }
  next();
};

const createBook = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { title, author, year } = req.body;
  const coverPage = req.file ? req.file.path : null;
  const book = new Book({ title, author, coverPage, year });
  await book.save();
  res.status(201).json(book);
};

const getBooks = async (req, res) => {
  const books = await Book.find();
  res.json(books);
};

const updateBook = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { title, author, year } = req.body;
  const book = await Book.findByIdAndUpdate(req.params.id, { title, author, year }, { new: true });
  if (!book) return res.status(404).send('Book not found');
  res.json(book);
};

const deleteBook = async (req, res, token) => {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).send('Book not found');
    res.send('Book deleted');
};

module.exports = {
  register,
  login,
  verifyToken,
  authorizeRoles,
  createBook,
  getBooks,
  updateBook,
  deleteBook,
  upload
};
