const express = require('express');
const router = express.Router();

let users = [

];

// Get all users
router.get('/', (req, res) => {
  res.json(users);
});

// Get user by ID
router.get('/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).send("User not found");
  res.json(user);
});

// Create new user
router.post('/', (req, res) => {
  const { name, email, mono } = req.body;
  const newUser = {
    id: users.length + 1,
    name,
    email,
    mono
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

// Update user
router.put('/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).send("User not found");

  const { name, email, mono } = req.body;
  user.name = name || user.name;
  user.email = email || user.email;
  user.mono = mono || user.mono;

  res.json(user);
});

// Delete user
router.delete('/:id', (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).send("User not found");

  const deletedUser = users.splice(index, 1);
  res.json(deletedUser[0]);
});

module.exports = router;
