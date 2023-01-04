var mongoose = require('mongoose');
let mongooseHidden = require("mongoose-hidden")();

var userSchema =mongoose.Schema({
   Tittle:String,
   Content: String
})

module.exports = mongoose.model("Posts", userSchema);  