var Blog = require('../models/blog');
var Blogger = require('../models/blogger');
var Genre = require('../models/genre');

const { body,validationResult } = require("express-validator");

var async = require('async');
//npm run devstart

exports.index=function(req,res){
    async.parallel({
        blog_count:function(callback){
            Blog.countDocuments({},callback);
        },

        blogger_count:function(callback){
            Blogger.countDocuments({},callback);
        },
        genre_count: function(callback) {
            Genre.countDocuments({},callback);
        },

    },function(err,results){
        res.render('index',{title:'WeBlog home',error:err, data:results});
    });
};




exports.blog_list=function(req,res,next){
    Blog.find({},'title blogger date')
        .sort({date:-1})
        .populate('blogger')
        .exec(function (err,list_blogs){
            if(err){return next(err)}
            else{
                res.render('blog_list',{title:"Blog List", blog_list: list_blogs});
            }
        });
};



// Display detail page for a specific blog.
exports.blog_detail = function(req, res, next) {

    async.parallel({
        blog: function(callback) {

            Blog.findById(req.params.id)
              .populate('blogger')
              .populate('genre')
              .exec(callback);
        },
        
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.blog==null) { // No results.
            console.log('blog not found');
            var err = new Error('Blog not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('blog_detail', { title: results.blog.title, blog:  results.blog } );
    });

};

// Display blog create form on GET.
exports.blog_create_get = function(req, res, next) {

    // Get all bloggers and genres, which we can use for adding to our blog.
    async.parallel({
        bloggers: function(callback) {
            Blogger.find(callback);
        },
        genres: function(callback) {
            Genre.find(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        res.render('blog_form', { title: 'Create Blog', bloggers: results.bloggers, genres:results.genres });
    });

};

exports.blog_create_post = [
    // Convert the genre to an array.
    (req, res, next) => {
        if(!(req.body.genre instanceof Array)){
            if(typeof req.body.genre==='undefined')
                req.body.genre=req.body.genre;
            else
                req.body.genre=new Array(req.body.genre);
        }
        next();
    },
    
    
    // Validate and sanitize fields.
    body('title', 'Title must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('blogger', 'blogger must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('content').trim().escape(),
    body('genre.*').escape(),
    // Process request after validation and sanitization.
    (req, res, next) => {
        

        // Extract the validation errors from a request.
        const errors = validationResult(req);
        
        // Create a blog object with escaped and trimmed data.
        var blog = new Blog(
          { title: req.body.title,
            blogger: req.body.blogger,
            content: req.body.content,
            date: Date.now(),
            genre: req.body.genre,
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.
            console.log("there are some erros");
            // Get all bloggers and genres for form.
            async.parallel({
                bloggers: function(callback) {
                    Blogger.find(callback);
                },
                genres: function(callback) {
                    Genre.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }

                // Mark our selected genres as checked.
                for (let i = 0; i < results.genres.length; i++) {
                    if (blog.genre.indexOf(results.genres[i]._id) > -1) {
                        results.genres[i].checked='true';
                    }
                }
                res.render('blog_form', { title: 'Post Blog', bloggers: results.bloggers, genres: results.genres, blog: blog, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Save blog.
            
            blog.save(function (err) {
                if (err) { return next(err); }
                   // Successful - redirect to new blog record.
                   
                   res.redirect(blog.url);
                });
        }
    }
];






