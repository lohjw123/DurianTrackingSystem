const express = require("express");
const path = require("path");
const app = express();

// Serve static files from the same directory as the server.js file
app.use(express.static(path.join(__dirname)));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const server = app.listen(5003);
const portNumber = server.address().port;
console.log(`Port is open on ${portNumber}`);