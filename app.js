const express =  require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require ('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');





mongoose.connect('mongodb://localhost/nodekb');
const db = mongoose.connection;

//Check connection
db.once('open',()=>{
    console.log('Connected to MongoDB');
});

//Check for DB error
db.on('error',(err)=>{
    console.log(err);
})



//init app
const app = express();

// port Number
const port = 4200;

//Bring in models
 let Article = require('./models/article');


//Load View Engine
app.set('views', path.join(__dirname,'views'));
app.set('view engine','pug');



// create application/json parser
app.use(bodyParser.json());

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }));


//Set Public Folder to add bower components
app.use(express.static(path.join(__dirname, 'public')));

//Express session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
  
  }));

//Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;
  
      while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param : formParam,
        msg   : msg,
        value : value
      };
    }
  }));



  // Home Route
app.get('/',(req, res)=>{
    Article.find({},(err,a)=>{

        if(err){

            console.log(err);
        }else{
            res.render('index',{
                title:'Articles',
                a: a
            });
        }
    });
    
});


//Route Files
let articles =require( './routes/articles');
app.use('/articles',articles)
    


// Set Server on port 4200
app.listen(port,()=>{

  console.log('Server running on port' +port);
});