const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.set("view engine", "ejs")

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));



app.get("/", (req, res) => {
  

  let today = new Date();
  let currentDay = today.getDay();

  if (currentDay === 6 || currentDay === 0) {
    res.write("<h1>Yey, it's the weekend ~! </h1>");
    res.write("<p>That means I don't have to work.</p>");
  } else {
    res.sendFile(__dirname + "/html/index.html");
  }
  
})









app.listen(process.env.PORT || 3000, () => {
  console.log("Todo List server is now running.")
})


