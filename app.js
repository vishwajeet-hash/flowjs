const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors()); // Enable CORS

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, "frontend/build")));

app.post("/upload", upload.single("file"), (req, res) => {
  const { originalname, filename } = req.file;
  const dest = path.join(__dirname, "uploads", originalname);

  fs.renameSync(req.file.path, dest);

  res.status(200).send("File uploaded successfully");
});

// Handles any requests that don't match the ones above
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/build", "index.html"));
});

app.listen(5000, () => {
  console.log("Server listening on port 5000");
});
