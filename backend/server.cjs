require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { PrismaClient } = require("@prisma/client");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const path = require("path");
const { ScanCommand } = require("@aws-sdk/lib-dynamodb");
const { docClient } = require("./lib/dynamoClient.cjs");
const { GetCommand } = require("@aws-sdk/lib-dynamodb");
const { PutCommand } = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require("uuid");
const { DeleteCommand } = require("@aws-sdk/lib-dynamodb");

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
    const result = await docClient.send(
      new ScanCommand({ TableName: "Posts" })
    );
    res.json(result.Items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd serwera przy pobieraniu postów" });
  }
});

app.get("/api/posts/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await docClient.send(
      new GetCommand({ TableName: "Posts", Key: { id } })
    );
    if (!result.Item) {
      return res.status(404).json({ error: "Post nie znaleziony" });
    }
    res.json(result.Item);
  } catch (err) {
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
    const id = uuidv4();

    try {
      const post = {
        id,
        title,
        content,
        category,
        image,
      };
      await docClient.send(new PutCommand({ TableName: "Posts", Item: post }));
      res.json(post);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Błąd serwera przy dodawaniu posta" });
    }
  }
);

app.delete("/api/posts/:id", authenticate, async (req, res) => {
  const id = req.params.id;

  try {
    await docClient.send(
      new DeleteCommand({ TableName: "Posts", Key: { id } })
    );
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
  const id = req.params.id;

  try {
    await docClient.send(
      new DeleteCommand({ TableName: "ServiceMessages", Key: { id } })
    );
    res.status(200).json({ message: "Wiadomość serwisowa usunięta" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Nastąpił błąd serwera podczas usuwania wiadomości serwisowej",
    });
  }
});

app.delete("/api/messages/:id", authenticate, async (req, res) => {
  const id = req.params.id;

  try {
    await docClient.send(
      new DeleteCommand({ TableName: "Messages", Key: { id } })
    );
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
    const result = await docClient.send(
      new ScanCommand({ TableName: "Messages" })
    );
    res.json(result.Items);
  } catch (err) {
    console.error("Błąd w /api/messages:", err);
    res.status(500).json({ error: "Błąd serwera przy pobieraniu wiadomości" });
  }
});
app.post("/api/serviceMessages", async (req, res) => {
  const { text } = req.body;
  const id = uuidv4();

  try {
    const newMessage = { id, text };
    await docClient.send(
      new PutCommand({ TableName: "ServiceMessages", Item: newMessage })
    );
    res.json(newMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Wystąpił błąd serwera podczas dodawania wiadomości",
    });
  }
});

app.get("/api/serviceMessages", async (req, res) => {
  try {
    const result = await docClient.send(
      new ScanCommand({ TableName: "ServiceMessages" })
    );
    res.json(result.Items);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Wystąpił błąd podczas pobierania wiadomości serwisowych",
    });
  }
});

app.post("/api/messages", async (req, res) => {
  const { email, message } = req.body;
  const id = uuidv4();

  try {
    const newMessage = { id, email, message };
    await docClient.send(
      new PutCommand({ TableName: "Messages", Item: newMessage })
    );
    res.json(newMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd serwera przy dodawaniu wiadomości" });
  }
});

app.get("/api/photos", async (req, res) => {
  try {
    const result = await docClient.send(
      new ScanCommand({ TableName: "Photos" })
    );
    res.json(result.Items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Błąd serwera" });
  }
});

app.post("/api/photos", upload.single("photo"), async (req, res) => {
  const { description } = req.body;
  const fileUrl = "/uploads/" + req.file.filename;
  const id = uuidv4();

  try {
    const newPhoto = {
      id,
      url: fileUrl,
      description,
    };
    await docClient.send(
      new PutCommand({ TableName: "Photos", Item: newPhoto })
    );
    res.status(201).json(newPhoto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Błąd podczas dodawania zdjęcia" });
  }
});

app.listen(port, () => {
  console.log(`Serwer działa na http://localhost:${port}`);
});
