const express = require('express');
const router = express.Router();


//Bring in models
let Article = require('../models/article');









//Add Route
router.get('/add',(req, res)=>{
    res.render('add',{
        title:'Add Articles'
    });
});

//Add Submit Post route
router.post('/add',(req, res)=>{
    req.checkBody('title','Title required').notEmpty();
    req.checkBody('author','Author required').notEmpty();
    req.checkBody('body','Body required').notEmpty();

//Get Errors
let errors = req.validationErrors();
if(errors){
    res.render('add',{
        title:'Add Article',
        errors:errors
    });
}else{
    
let article = new Article();

article.title = req.body.title;
article.author = req.body.author;
article.body = req.body.body;
console.log('Data Submitted');
    article.save((err)=>{
        if(err){
            console.log(err);
            }else{
                req.flash('success','Article Added');
                res.redirect('/');
                    }
    });
}




   
  
    
});


//Load edit Form Route 
router.get('/edit/:id',(req, res)=>{
    Article.findById(req.params.id,(err,article)=>{

        res.render('edit_article',{
            article:article
        });
    });

});

//Update Submit Post Route
router.post('/edit/:id',(req, res)=>{
    let article = {};
   
   article.title = req.body.title;
   article.author = req.body.author;
   article.body = req.body.body;
   

   let query = {_id:req.params.id};

   
   Article.update(query,article,(err)=>{
        if(err){
            console.log(err);
            }else{
             req.flash('success','Article Updated');
             res.redirect('/');
                    }
   });
    
})

// Delete Article Route
router.delete('/:id',(req, res)=>{
    let query = {_id:req.params.id};
    Article.remove(query, function(err){
        if(err){
          console.log(err);
        }
        res.send('Success');
      });
});

//Get Single Article Route
router.get('/:id',(req, res)=>{
    Article.findById(req.params.id,(err,article)=>{

        res.render('article',{
            article:article
        });
    });

});



module.exports = router;
  