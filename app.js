var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
var mongoose = require('mongoose');

// configure the app to use bodyParser()


mongoose.connect('mongodb://localhost/merndb');
var personSchema = mongoose.Schema({
   firstName: String,
   lastName: String,
   userName: String,
   password:String,
   confirmpassword:String,
   email:String,
   gender:String,
   country:String
});
var Person = mongoose.model("Person", personSchema);

module.exports=Person;
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/login.html");
});

app.post('/login', function(req, res){
    //console.log(JSON.stringify(req.body));
    Person.find({userName:req.body.userName, password:req.body.password}, 
    //Person.find((u)=>(u.userName===req.body.userName && u.password===req.body.password),
   function(err, response){
       if(err){
        
           res.send("invalid data");
       }

      res.json(response[0]);
});
    });
    
app.get("/register", (req, res) => {
        res.sendFile(__dirname + "/register.html");
    });
app.post("/person", function(req, res){
    //console.log(JSON.stringify(req.body));

    if((req.body.firstName=='')||(req.body.lastName=='' )||(req.body.userName=='') ||( req.body.password=='')||(req.body.email=='')||(req.body.country=='')){ 
   res.json({error:"fill all the fileds"});
    } else {
       console.log(JSON.stringify(req.body));
       var newPerson = new Person(req.body);       
       newPerson.save(function(err, Person){
          if(err)
          res.json({ error: "database error"});
          else
         res.json(newPerson);
       });
    }
 });

 app.get('/users', function(req, res){
     Person.find(function(err,Person){
         if(err) throw err;
         res.json(Person);
     })
 });



 app.listen(3001);
