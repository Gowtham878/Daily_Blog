//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lodash = require("lodash")
const tolower = lodash.toLower
const { json } = require("body-parser");
const mongoose = require('mongoose');
const e = require("express");
const Posts = require('./user_model')

////////////////////////////////////////////////////////////////////////////////
const url = 'mongodb+srv://gotham:'+encodeURIComponent('G0thamXmongo')+'@journal.4ok3oge.mongodb.net/journal?retryWrites=true&w=majority'
mongoose.set('strictQuery', false)
try{mongoose.connect(url,{useNewUrlParser : true})}
catch(err){console.log(err)}
/////////////////////////////////////////////////////////////////////////////////
const homeStartingContent ="Home content..."//"Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

///////////////////////////////////////////////////////////////////////////   home{
  app.get('/',(req,res)=>{
    res.redirect('/home')
  })
app.get('/home', (req, res) => {
    Posts.find((err, docs)=> {
      //console.log(docs)
      var posts = docs
      res.render("home", {  hc: homeStartingContent, postlist:posts})
  })

})


//app.post("/", (req,res) =>{})



///////////////////////////////////////////////////////////////////////////  about
app.get('/home/about', (req, res) => {
    res.render("about", { about: aboutContent })
})
//////////////////////////////////////////////////////////////////////////  contact us
app.get('/home/contactus', (req, res) => {
    res.render("contact", { contact: contactContent })
})
////////////////////////////////////////////////////////////////////////// compose

app.get('/home/compose', (req, res) => {
    res.render("compose", { contact: contactContent })
})
app.post('/home/compose', (req, res) =>{ 
      let posttittle = tolower(req.body.T) 
      var data= {Tittle: posttittle,Content: req.body.postcon}
      const docs = new Posts(data)
      docs.save(function (err, res) {
        console.log("Post saved")
      })

  res.redirect("/home")

})
//////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////// posts

app.get('/home/:posts', (req, res) => {
  let ntittle = tolower(req.params.posts)
    Posts.findOne({Tittle:ntittle},(err,record) =>{
      if(err){
        console.log("Record does not exist")
      }
      else{
        const tittle = record.Tittle
        const capitalized_tittle =tittle.charAt(0).toUpperCase()+ tittle.slice(1)
        res.render("post", { pt: capitalized_tittle, pc: record.Content })
      }
    })   
}) 
//////////////////////////////////////////////// delete posts

app.post('/home/:posts',(req,res) =>{
  console.log(req.params)
  const Post_tittle = tolower(req.params.posts)
Posts.deleteOne({Tittle: Post_tittle},(err)=>{
  if(err){
    console.log("Cannot delete, please try again.")
  }
  else{
    console.log("Post deleted!")
    res.set({'Refresh': '8; url=/home'});
    res.send("Post Deleted")
  }
})
})

/////////////////////////////////////////////////////////////////////////// all posts

app.get('/home/posts/:posts', (req, res) => {
  const ntittle = tolower(req.params.posts)
  Posts.findOne({Tittle:ntittle},(err,record) =>{
    if(err){
      console.log("Record does not exist")
    }
    else{
      const tittle = record.Tittle
      const capitalized_tittle =tittle.charAt(0).toUpperCase()+ tittle.slice(1)
      res.render("post", { pt: capitalized_tittle, pc: record.Content })
    }
  })   
})  

///////////////////////////////////////////////////////////


app.listen(3000, function() {
  console.log("Server started on port 3000");
})
