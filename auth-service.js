const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
app.use(express.json());

const PORT = process.env.AUTH_PORT || 4000;
const SECRET_KEY = process.env.SECRET_KEY || 'mysterykey';

const users = [];

// Register User
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required." });
    }

    if (users.find(user => user.username === username)) {
        return res.status(400).json({ error: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });

    res.status(201).json({ message: 'User registered successfully' });
});

// Login User
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Invalid Credentials' });
    }

    const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
});

// Delete User
app.delete('/api/users/:username', (req, res) => {
    const { username } = req.params;

    const userIndex = users.findIndex(user => user.username === username);
    if (userIndex === -1) {
        return res.status(404).json({ error: "User not found." });
    }

    users.splice(userIndex, 1); // Remove the user from the array
    res.json({ message: `User ${username} deleted successfully.` });
});

// Get All Registered Users (For Debugging)
app.get('/api/users', (req, res) => {
    const userList = users.map(user => ({ username: user.username })); // Hide passwords
    res.json(userList);
});


// Start Authentication Service
app.listen(PORT, () => {
    console.log(`Auth Service running on port ${PORT}`);
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token.' });
        }
        req.user = user;
        next();
    });
}

app.get('/api/protected', authenticateToken, (req, res) => {
    res.json({ message: "You have access to the protected route", user: req.user });
});
