

console.log('This script populates some test blogs, bloggers, genres to your database. Specified database as argument - e.g.: populatedb mongodb+srv://bei:<password>@chenjiecluster2.x5gcy.mongodb.net/cs5610web?retryWrites=true&w=majority');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Blog = require('./models/blog')
var Blogger = require('./models/blogger')
var Genre = require('./models/genre')



var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var bloggers = []
var genres = []
var blog = []


function bloggerCreate(first_name, family_name, d_birth, cb) {
  bloggerdetail = {first_name:first_name , family_name: family_name }
  if (d_birth != false) bloggerdetail.date_of_birth = d_birth
  
  
  var blogger = new blogger(bloggerdetail);
       
  blogger.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Blogger: ' + blogger);
    bloggers.push(blogger)
    cb(null, blogger)
  }  );
}

function genreCreate(name, cb) {
  var genre = new Genre({ name: name });
       
  genre.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Genre: ' + genre);
    genres.push(genre)
    cb(null, genre);
  }   );
}

function blogCreate(title, content, blogger, genre, cb) {
  bookdetail = { 
    title: title,
    content: content,
    author: blogger,
    date: Date.now()
  }
  if (genre != false) blogdetail.genre = genre
    
  var blog = new Blog(blogdetail);    
  blog.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Blog: ' + blog);
    blogs.push(blog)
    cb(null, blog)
  }  );
}

function createGenreBloggers(cb) {
    async.series([
        function(callback) {
          bloggerCreate('Chen', 'jie', '2000-01-01', callback);
        },
        function(callback) {
          bloggerCreate('Jack', 'Bova', '2000-11-8', callback);
        },
        function(callback) {
          bloggerCreate('Zhen', 'Jennt', '1999-01-02', callback);
        },
        function(callback) {
          bloggerCreate('Bob', 'Bill', '1980-02-03', callback);
        },
        function(callback) {
          bloggerCreate('Jim', 'Jones', '1978-12-16', callback);
        },
        function(callback) {
          genreCreate("Daily Chores", callback);
        },
        function(callback) {
          genreCreate("Poetry", callback);
        },
        function(callback) {
          genreCreate("Fiction", callback);
        },
        ],
        // optional callback
        cb);
}


function createBlogs(cb) {
    async.parallel([
        function(callback) {
          blogCreate('Happy Birthday', 'Please wish me a happy birthday', bloggers[0], [genres[0],], callback);
        },
        function(callback) {
          blogCreate("Today's feeling", 'Do not know sorrow or joy, holding what kind of mentality', bloggers[0], [genres[0],], callback);
        },
        function(callback) {
          blogCreate("Video Interview", 'I have a video interview next week and I need to prepared well for it.', bloggers[0], [genres[0],], callback);
        },
        function(callback) {
          blogCreate("I want to write a fiction", "I want to write a fiction. Let me start tomorrow.", bloggers[1], [genres[1],], callback);
        },
        function(callback) {
          blogCreate("first blog","This is my first blog",  bloggers[1], [genres[1],], callback);
        },
        ],
        // optional callback
        cb);
}



async.series([
    createGenreBloggers,
    createBlogs,
    
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {

    }
    // All done, disconnect from database
    mongoose.connection.close();
});




