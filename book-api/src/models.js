const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'Author', 'Reader'], required: true }
});

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  coverPage: { type: String, required: false },
  year: { type: Number, required: true }
});

const User = mongoose.model('User', UserSchema);
const Book = mongoose.model('Book', BookSchema);

module.exports = { User, Book };
