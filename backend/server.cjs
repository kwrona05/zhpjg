require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { PrismaClient } = require('@prisma/client');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const prisma = new PrismaClient();
const port = 4000;
const SECRET = '0394u49u34b5#123!';

app.use(cors());
app.use(bodyParser.json());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'uploads'));
    },
    filename: (req, file, callback) =>
        callback(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// Logowanie
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    if (username === 'andrzej' && password === '2023') {
        const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ error: 'Nieprawidłowe dane logowania' });
    }
});

// Middleware do autoryzacji
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(403).json({ error: 'Brak tokena autoryzacyjnego' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(403).json({ error: 'Nieprawidłowy token' });
    }
};

// Pobieranie postów
app.get('/api/posts', async (req, res) => {
    try {
        const posts = await prisma.post.findMany();
        res.json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Błąd serwera przy pobieraniu postów' });
    }
});

// Pobieranie konkretnego posta
app.get('/api/posts/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const post = await prisma.post.findUnique({ where: { id: Number(id) } });
        if (!post) {
            return res.status(404).json({ error: 'Post nie znaleziony' });
        }
        res.json(post);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Błąd serwera' });
    }
});

// Dodawanie posta
app.post('/api/posts', authenticate, upload.single('image'), async (req, res) => {
    const { title, content, category } = req.body;
    const image = req.file ? req.file.filename : null;

    try {
        const post = await prisma.post.create({
            data: { title, content, category, image },
        });
        res.json(post);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Błąd serwera przy dodawaniu posta' });
    }
});

// Usuwanie posta
app.delete('/api/posts/:id', authenticate, async (req, res) => {
    const postId = parseInt(req.params.id);

    try {
        await prisma.post.delete({ where: { id: postId } });
        res.status(200).json({ message: 'Post usunięty' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Błąd serwera podczas usuwania posta' });
    }
});

// Obsługa uploadów
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/api/uploads', authenticate, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Brak pliku' });
    }
    res.json({ filename: req.file.filename });
});

app.get('/api/messages', async (req, res) => {
    try {
        console.log("Pobieram wiadomości...");
        const messages = await prisma.message.findMany();
        console.log("Wiadomości:", messages);
        res.json(messages);
    } catch (err) {
        console.error("Błąd w /api/messages:", err);
        res.status(500).json({ error: 'Błąd serwera przy pobieraniu wiadomości' });
    }
});

app.post('/api/messages', async (req, res) => {
    const { email, message } = req.body;
    try {
        const newMessage = await prisma.message.create({
            data: {
                email,
                message,
            },
        });
        res.json(newMessage);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Błąd serwera przy dodawaniu wiadomości' });
    }
});

app.listen(port, () => {
    console.log(`Serwer działa na http://localhost:${port}`);
});
