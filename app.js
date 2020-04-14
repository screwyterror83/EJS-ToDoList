const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.sendFile(__dirname + "html/index.html");
})












app.listen(process.env.PORT || 3000, () => {
  console.log("Todo List server is now running.")
})


