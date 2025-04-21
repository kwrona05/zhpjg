require('dotenv').config()
const express = require('express')
const cors = require('cors')
const multer = require('multer')
const {PrismaClient} = require('@prisma/client')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const path = require('path')

const app = express()
const prisma = new PrismaClient()
const port = 4000
const SECRET = '0394u49u34b5#123!'

app.use(cors())
app.use(bodyParser.json())

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'uploads'));},
    filename: (req, file, callback) => callback(null, Date.now() + '-' + file.originalname)
})
const upload = multer({storage})

app.post('/api/login', async (req, res) => {
    const {username, password} = req.body
    if(username === 'andrzej' && password === '2023'){
        const token = jwt.sign({username}, SECRET, {expiresIn: '1h'})
        res.json({token})
    } else {
        res.status(401).json({error: 'invalid credential'})
    }
})

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization
    if(!authHeader) {
        return res.status(403)
    }
    const token = authHeader.split(' ')[1]
    try {
        const username = jwt.verify(token, SECRET)
        req.user = username
        next()
    } catch (err) {
        res.sendStatus(403)
    }
}

app.get('/api/posts', async (req, res) => {
    const posts = await prisma.post.findMany()
    res.json(posts)
    console.log(process.env.DATABASE_URL)
})

app.get('/api/posts/:id', async (req, res) => {
    const id = req.params
    try {
        const post = await prisma.post.findUnique({where: {id: Number(id)}})
        if(!post) {
            return res.status(404).json({error: 'Post not found'})
        }
        res.json(post)
    } catch (err) {
        res.status(500).json({error: 'Server Error'})
    }
})

app.post('/api/posts', authenticate, upload.single('image'), async (req, res) => {
    const { title, content } = req.body;
    const image = req.file ? req.file.filename : null;

    try {
        const post = await prisma.post.create({
            data: { title, content, image }
        });

        res.json(post);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.post('/api/uploads', authenticate, upload.single('image'), (req, res) => {
    if(!req.file) {
        return res.status(400).json({error: 'Post not found'})
    }
    res.json({filename: req.file.filename})
})

app.listen(port, () => {console.log(`Listening on http://localhost:${port}`)})