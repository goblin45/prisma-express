// index.js

const express = require('express');
const bodyParser = require('body-parser');
const prisma = require('./prismaClient');

const app = express();
app.use(bodyParser.json());

const port = 3000;

// Create a new user
app.post('/users', async (req, res) => {
  const { name, email } = req.body;
  try {
    const user = await prisma.user.create({
      data: { name, email },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'User could not be created' });
  }
});

// Get all users
app.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Users could not be fetched' });
  }
});

// Get a single user by ID
app.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'User could not be fetched' });
  }
});

// Update a user by ID
app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: { name, email },
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'User could not be updated' });
  }
});

// Delete a user by ID
app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.delete({
      where: { id: Number(id) },
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'User could not be deleted' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
