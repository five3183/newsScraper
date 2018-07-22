var express = require("express")
var router = express.Router()
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("../models");

// SCRAPE HERE
router.get("/scrape", function(req, res) {
    axios.get("http://www.nytimes.com").then(function(response) {
      var $ = cheerio.load(response.data);
      $("h2.story-heading").each(function(i, element) {
        var result = {};
        result.title = $(this)
          .children("a")
          .text();
        result.link = $(this)
          .children("a")
          .attr("href");
        db.Article.create(result)
          .then(function(dbArticle) {
            console.log(dbArticle);
          })
          .catch(function(err) {
            return res.json(err);
          });
      });
      res.redirect('/')
    });
  });
  
  // get the articles
  router.get("/articles", function(req, res) {
    db.Article.find({})
      .then(function(dbArticle) {
        res.json(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });
  
  // Route for grabbing a specific Article by id, populate it with it's note
  router.get("/articles/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate("note")
      .then(function(dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  
  // Route for saving/updating an Article's associated Note
  router.post("/articles/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
      .then(function(dbNote) {
        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then(function(dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  
  //CREATE SAVED ARTICLE
  router.post("/saved", function (req, res) {
    console.log("line 80 " + req.body.data)
    var data = req.body
    
    
    var title= data.title
    var link= data.link
    var note= "Add Note Here!"

    var saveArticle = {
      title: title,
      link: link,
      note: note
    }
    
    console.log("line 94 " + saveArticle)
    db.Saved.create(saveArticle)
    .then(function(dbSaved) {
      console.log(dbSaved)
    })
    .catch(function(err) {
      return res.json(err);
    });
  })

  // GET SAVED ARTICLES
  router.get("/saved", function(req, res) {
    // Grab every document in the Articles collection
    db.Saved.find({})
      .then(function(dbSaved) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbSaved);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  module.exports = router