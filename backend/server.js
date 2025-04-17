const express = require('express')
const cors = require('cors')
const multer = require('multer')
const {PrismaClient} = require('@prisma/client')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')

const app = express()
const prisma = new PrismaClient()
const port = 4000
const SECRET = '0394u49u34b5#123!'

app.use(cors())
app.use(bodyParser.json())

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, callback) => callback(null, Date.now() + '-' + file.originalname)
})
const upload = multer({storage})

app.post('api/login', async (req, res) => {
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
        const user = jwt.verify(token, SECRET)
        req.user = user
        next()
    } catch (err) {
        res.sendStatus(403)
    }
}

app.get('api.posts', async (req, res) => {
    const posts = await prisma.post.findMany()
    res.json(posts)
})

app.post('api/upload', authenticate, upload.single('image'), (req, res) => {
    res.json({filename: req.file.filename})
})

app.listen(port, () => {console.log(`Listening on http://localhost:${port}`)})