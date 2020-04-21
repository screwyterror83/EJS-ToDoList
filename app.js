const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const mongoose = require("mongoose");
// const date = require(__dirname + "/date.js");


const app = express();

/* enable ejs frame work inside main js file */
app.set("view engine", "ejs");

/* express server will server static files after moving files to "public" directory*/
app.use(express.static("public"));

/* parse post data */
app.use(bodyParser.urlencoded({
  extended: true
}));

// MongoDB URL
const url = "mongodb://localhost:27017"

// DB Name
const dbName = "todolistDB"

mongoose.connect(url + "/" + dbName, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
});

const itemSchema = new mongoose.Schema({
  name: String
});

const Item = mongoose.model("Item", itemSchema);
/* model creation: const <> = mongoose.model(<"singularCollectionName">, <schemaName>) */

const listSchema = new mongoose.Schema({
  name: String,
  item: [itemSchema]
});

const List = mongoose.model("List", listSchema)

/* this will use MongoDB instead of static array to store data */
// const items = [];
// const workItems = [];

const item1 = new Item({
  name: "Welcome to your ToDo List"
});

const item2 = new Item({
  name: "You can write down a thing you want to do."
});

const item3 = new Item({
  name: "This will be stored in MongoDB"
})

const defaultItems = [item1, item2, item3]



app.get("/", (req, res) => {

  // let day = date.getDate()
  // for simplicity, we will not use complex date.getDate() custom module

  /* render the file name "list.ejs" under "view/" directory.a
  use ejs file to replace html file, but ejs file have same functionality of html files*/

  Item.find({}, (err, listItem) => {
    if (err) {

      console.log(err);

    } else if (listItem.length === 0) {

      /* check if listItem is empty, if it's empty, it will insert the some default
      items in the listItems, so it can show up on the /home page. 
      This also prevents the code from adding the defaultItems to DB everytime code restarted*/
      Item.insertMany(defaultItems, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("default Items has been saved to DB.");
        }
      });
      /* re-enter /home page to have the default items show up on screen. */
      res.redirect("/");
    } else {
      /* if default list of item is saved to DB, it will not save them again, 
      instead, it will show the defaultList items on the scrren */
      res.render("list", {
        listTitle: "Today",
        newListItems: listItem
      });
    }
  })

  // res.render("list", { listTitle: day, newListItems: items });
  // res.render("list", { listTitle: "Today", newListItems: items });
});

app.get("/:listName", (req, res) => {
  /* Dynamic route name using express parameter feature */
  console.log(req.params.listName);
  const listName = _.kebabCase(req.params.listName);

  // res.render("list", {
  //   listTitle: "Work List",
  //   newListItems: workItems
  // });
});

app.get("/about", (req, res) => {
  res.render("about");
});


app.post("/", (req, res) => {

  console.log(req.body);

  let itemName = req.body.newItem;

  const item = new Item({
    name: itemName
  });

  /* ".save()" method will work as native MongoDB method ".insertOne()", 
  the purpose of this ".save()" method is as its name, save the document \
  to collection.*/
  item.save()

  /* alway use res.redirect("/") to go back to home page in order to refresh
  load of DB documents to show up */
  res.redirect("/")
  /* COMMENT out ordinary add item, since this is no longer a static array 
  declared in the beginning of this code. */
  // if (req.body.list === "Work") {
  //   workItems.push(item);
  //   res.redirect("/work")
  // } else {
  //   items.push(item);
  //   res.redirect("/");
  // }

});

app.post("/delete", (req, res) => {
  
  /* created new route "/delete" based on list.ejs, use "_id" as identifier to determine
  if item in collection can be deleted. */

  const checkItemId = req.body.checkedBox;
  console.log(req.body.checkedBox);

/* Here can use deleteOne method or to use findByIdAndRemove method */
  
  Item.findByIdAndRemove(checkItemId, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Checked Item Successfully Deleted");
      res.redirect("/");
    }
  });

  /* either of these should work, but .findByIdAndRemove would be more straightforward. */
  
  // Item.deleteOne({ _id: checkItemId }, (err) => {
  //   if (err) {
  //     console.log(err)
  //   } else {
  //     console.log("Item deleted")
  //     res.redirect("/");
  //   }
  // });
  
})




app.listen(process.env.PORT || 3000, () => {
  console.log("Todo List server is now running.")
})
