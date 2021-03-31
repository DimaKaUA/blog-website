//jshint esversion:6

const express = require("express");
const _ = require("lodash");
const MongoClient = require("mongodb").MongoClient;
const assert = require('assert');

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({
  extended: true
}));
app.use(express.static("public"));

const CONNECTION_URL = "mongodb://localhost:27017";
const DATABASE_NAME = "blog-website-pure-mdb";
var database, collection;

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

app.get("/", function(req, res) {

  collection.find({}).toArray((error, result) => {
    if (error) {
      return res.status(500).send(error);
    }
    res.render("home", {
      content: homeStartingContent,
      postList: result
    });
  });
});

app.get("/contact", function(req, res) {
  res.render("contact", {
    content: aboutContent
  });
});

app.get("/about", function(req, res) {
  res.render("about", {
    content: contactContent
  });
});

app.get("/compose", function(req, res) {
  res.render("compose");
});

app.post("/compose", function(req, res) {
  const post = {
    title: req.body.postTitle,
    content: req.body.postBody
  };

  collection.insertOne(post, (error, result) => {
    if(error) {
        return res.status(500).send(error);
    }
    console.log(result.result);
  });

  res.redirect("/");
});

app.get("/posts/:postTitle", function(req, res) {
  const postTitle = req.params.postTitle;
  collection.findOne({ "title": postTitle }, (error, result) => {
    if(error) {
        return res.status(500).send(error);
    }
    if(result) {
      res.render("post", {
        post: result
      });
    } else {
      console.log("Match not found");
      res.redirect("/");
    }
  });

  // posts.forEach((post, i) => {
  //   if (_.lowerCase(post.title) === _.lowerCase(postTitle)) {
  //
  //     collection.findOne({ "title": postTitle }, (error, result) => {
  //       if(error) {
  //           return res.status(500).send(error);
  //       }
  //       res.render("post", {
  //         post: result
  //       });
  //     });
  //   } else {
  //     console.log("Match not found");
  //     res.redirect("/");
  //   }
  // });

});

app.listen(3000, function() {
  console.log("Server started on port 3000");

  // Create a new MongoClient
  const client = new MongoClient(CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  // Use connect method to connect to the Server
  client.connect(function(err) {
    assert.equal(null, err);
    console.log("Connected to `" + DATABASE_NAME);

    database = client.db(DATABASE_NAME);
    collection = database.collection("posts");
  });

  process.on("SIGINT", function() {
    client.close(function () {
      console.log("Mongodb disconnected on app termination");
      process.exit(0);
    });
  });
});
