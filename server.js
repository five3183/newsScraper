var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

router = require("./controllers/routes.js")

var path = require("path")
var PORT = 3000;
var app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")))
app.use("/", router)

mongoose.connect("mongodb://localhost/newsScraper");

app.listen(PORT, function () {
    console.log("App running on PORT: " + PORT)
})