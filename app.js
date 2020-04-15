const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const date = require(__dirname + "/date.js");

const app = express();

const items = [];
const workItems = [];

/* enable ejs frame work inside main js file */
app.set("view engine", "ejs");

/* express server will server static files after moving files to "public" directory*/
app.use(express.static("public"));

/* parse post data */
app.use(bodyParser.urlencoded({ extended: true }));



app.get("/", (req, res) => {
  
  let day = date.getDate()
  /* render the file name "list.ejs" under "view/" directory.a
  use ejs file to replace html file, but ejs file have same functionality of html files*/
  res.render("list", { listTitle: day, newListItems: items });
  
});

app.post("/", (req, res) => {
  
  console.log(req.body);

  let item = req.body.newItem;

  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work")
  } else {
    items.push(item);
    res.redirect("/");
  }

});


app.get("/work", (req, res) => {
  res.render("list", { listTitle: "Work List", newListItems: workItems });
})

app.get("/about", (req, res) => {
  res.render("about")
})


app.listen(process.env.PORT || 3000, () => {
  console.log("Todo List server is now running.")
})


