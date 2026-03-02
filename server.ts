import express from 'express';

const app = express();
const port = 3000;

app.use(express.json());

const users = [
  { id: 1, name: 'Alice', age: 25 },
  { id: 2, name: 'Bob', age: 30 },
];

app.get('/users', (req, res) => {
  res.json(users);
});

app.post('/users', (req, res) => {
  const newUser = req.body;
  console.log('New user added:', newUser);
  res.status(201).json({ message: 'User added successfully', user: newUser });
});

app.get('/greet', (req, res) => {
  res.send('Hello, developer!');
});

app.post('/submit', (req, res) => {
  const { name, age } = req.body;
  res.json({ message: `Hello, ${name}! You are ${age} years old.` });
});

app.get('/', (req, res) => {
  res.send('Welcome to our API!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

