require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { PrismaClient } = require("@prisma/client");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const path = require("path");

const app = express();
const prisma = new PrismaClient();
const port = 4000;
const SECRET = "0394u49u34b5#123!";

app.use(cors());
app.use(bodyParser.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: (req, file, callback) =>
    callback(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  if (username === "andrzej" && password === "2023") {
    const token = jwt.sign({ username }, SECRET, { expiresIn: "1h" });
    res.json({ token });
  } else {
    res.status(401).json({ error: "Nieprawidłowe dane logowania" });
  }
});

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(403).json({ error: "Brak tokena autoryzacyjnego" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: "Nieprawidłowy token" });
  }
};

app.get("/api/posts", async (req, res) => {
  try {
    const posts = await prisma.post.findMany();
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd serwera przy pobieraniu postów" });
  }
});

app.get("/api/posts/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const post = await prisma.post.findUnique({ where: { id: Number(id) } });
    if (!post) {
      return res.status(404).json({ error: "Post nie znaleziony" });
    }
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd serwera" });
  }
});

app.post(
  "/api/posts",
  authenticate,
  upload.single("image"),
  async (req, res) => {
    const { title, content, category } = req.body;
    const image = req.file ? req.file.filename : null;

    try {
      const post = await prisma.post.create({
        data: { title, content, category, image },
      });
      res.json(post);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Błąd serwera przy dodawaniu posta" });
    }
  }
);

app.delete("/api/posts/:id", authenticate, async (req, res) => {
  const postId = parseInt(req.params.id);

  try {
    await prisma.post.delete({ where: { id: postId } });
    res.status(200).json({ message: "Post usunięty" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Błąd serwera podczas usuwania posta" });
  }
});

// app.put("/api/posts/:id", async (req, res) => {
//   const { id } = req.params;
//   const { title, content } = req.body;

//   try {
//     const updatePost = await prisma.post.update({
//       where: { id: parseInt(id) },
//       data: {
//         title,
//         content,
//       },
//     });

//     res.json(updatedPost);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Post not found" });
//   }
// });

app.put("/api/posts/:id", upload.single("image"), async (req, res) => {
  const { title, content, category } = req.body;
  const id = parseInt(req.params.id);

  try {
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        category,
        image: req.file ? req.file.filename : undefined, // opcjonalnie
      },
    });

    res.json(updatedPost);
  } catch (error) {
    console.error("Błąd aktualizacji posta:", error);
    res.status(500).json({ error: "Nie udało się zaktualizować posta" });
  }
});

app.get("/api/posts", async (req, res) => {
  const search = req.query.search || "";
  try {
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { content: { contains: search, mode: "insensitive" } },
        ],
      },
    });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Wystąpił błąd serwera" });
  }
});

app.delete("/api/serviceMessages/:id", authenticate, async (req, res) => {
  const serviceMessageId = parseInt(req.params.id);

  try {
    await prisma.serviceMessage.delete({ where: { id: serviceMessageId } });
    res.status(200).json({ message: "Wiadomość serwisowa usunięta" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Nastąpił błąd serwera podczas usuwania wiadomości serwisowej",
    });
  }
});

app.delete("/api/messages/:id", authenticate, async (req, res) => {
  const messageId = parseInt(req.params.id);

  try {
    await prisma.message.delete({
      where: { id: messageId },
    });
    res.status(200).json({ message: "Wiadomość została usunięta." });
  } catch (error) {
    console.error("Błąd przy usuwaniu wiadomości:", error);
    res.status(500).json({ error: "Błąd serwera przy usuwaniu wiadomości." });
  }
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.post("/api/uploads", authenticate, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Brak pliku" });
  }
  res.json({ filename: req.file.filename });
});

app.get("/api/messages", async (req, res) => {
  try {
    console.log("Pobieram wiadomości...");
    const messages = await prisma.message.findMany();
    res.json(messages);
  } catch (err) {
    console.error("Błąd w /api/messages:", err);
    res.status(500).json({ error: "Błąd serwera przy pobieraniu wiadomości" });
  }
});

app.post("/api/serviceMessages", async (req, res) => {
  const { text } = req.body;
  try {
    const newMessage = await prisma.serviceMessage.create({
      data: {
        text,
      },
    });
    res.json(newMessage);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Wystąpił błąd serwera podczas dodawania wiadomości" });
  }
});

app.get("/api/serviceMessages", async (req, res) => {
  try {
    const serviceMessages = await prisma.serviceMessage.findMany();
    res.json(serviceMessages);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Wystąpił błąd podczas pobierania wiadomości serwisowych",
    });
  }
});

app.post("/api/messages", async (req, res) => {
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
    res.status(500).json({ error: "Błąd serwera przy dodawaniu wiadomości" });
  }
});

app.get("/api/photos", async (req, res) => {
  try {
    const photos = await prisma.photo.findMany({
      orderBy: { id: "asc" },
    });
    res.json(photos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Błąd serwera" });
  }
});

app.post("/api/photos", upload.single("photo"), async (req, res) => {
  try {
    const description = req.body.description;
    const fileUrl = "/uploads/" + req.file.filename;

    const newPhoto = await prisma.photo.create({
      data: {
        url: fileUrl,
        description,
      },
    });
    res.status(201).json(newPhoto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Błąd podczas dodawania zdjęcia" });
  }
});

app.listen(port, () => {
  console.log(`Serwer działa na http://localhost:${port}`);
});
