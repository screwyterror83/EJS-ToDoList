const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

const items = [];
const workItems = [];

app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));



app.get("/", (req, res) => {
  

  let today = new Date();

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }

  let day = today.toLocaleDateString("en-US", options);



  /* render the file name "list.ejs" under "view/" directory*/
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


app.listen(process.env.PORT || 3000, () => {
  console.log("Todo List server is now running.")
})


