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

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scraped"


mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);


app.listen(PORT, function () {
    console.log("App running on PORT: " + PORT)
})
