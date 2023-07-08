const express = require("express");
const jsonServer = require("json-server");
const fs = require('fs');
require('dotenv').config();

const app = express();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 8080;

app.use(middlewares);
app.use(express.json());

app.get("/cardDetails", (req, res) => {
  const cardDetails = router.db.get("cardDetails");
  res.json(cardDetails);
});

app.get("/camping", (req, res) => {
  const camping = router.db.get("camping");
  res.json(camping);
});

app.get("/city", (req, res) => {
  const city = router.db.get("city");
  res.json(city);
});

const readDataFromFile = () => {
  const rawData = fs.readFileSync('db.json');
  return JSON.parse(rawData);
};

const writeDataToFile = (data) => {
  const jsonData = JSON.stringify(data, null, 2);
  fs.writeFileSync('db.json', jsonData);
};

app.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;

    const users = readDataFromFile().users;

    const existingUser = users.find((user) => user.username === username);
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    const newUser = { username, password };
    users.push(newUser);

    writeDataToFile({ ...readDataFromFile(), users });

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const users = readDataFromFile().users;

    const user = users.find((user) => user.username === username);
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Error during user login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.use(router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
