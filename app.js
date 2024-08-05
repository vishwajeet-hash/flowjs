const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const PORT = 5000;

const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/upload", (req, res) => {
  upload.single('file')(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.error("Multer error:", err);
      return res.status(500).send("Upload error: " + err.message);
    } else if (err) {
      console.error("Unknown error:", err);
      return res.status(500).send("Unknown error occurred");
    }

    console.log("File received:", req.file);
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    res.status(200).send("File uploaded successfully");
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});