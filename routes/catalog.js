var express = require('express');
var router = express.Router();


// Require our controllers.
var blog_controller = require('../controllers/blogController'); 
var blogger_controller = require('../controllers/bloggerController');
var genre_controller = require('../controllers/genreController');



/// BOOK ROUTES ///

// GET catalog home page.
router.get('/', blog_controller.index);  

// GET request for creating a Book. NOTE This must come before routes that display Book (uses id).
router.get('/blog/create', blog_controller.blog_create_get);

// POST request for creating Book.
router.post('/blog/create', blog_controller.blog_create_post);

// GET request to delete Book.
//router.get('/book/:id/delete', book_controller.book_delete_get);

// POST request to delete Book.
//router.post('/book/:id/delete', book_controller.book_delete_post);

// GET request to update Book.
//router.get('/book/:id/update', book_controller.book_update_get);

// POST request to update Book.
//router.post('/book/:id/update', book_controller.book_update_post);

// GET request for one Book.
router.get('/blog/:id', blog_controller.blog_detail);

// GET request for list of all Book.
router.get('/blogs', blog_controller.blog_list);

/// AUTHOR ROUTES ///

// GET request for creating Author. NOTE This must come before route for id (i.e. display author).
router.get('/blogger/create', blogger_controller.blogger_create_get);

// POST request for creating Author.
router.post('/blogger/create', blogger_controller.blogger_create_post);

// GET request to delete Author.
//router.get('/author/:id/delete', author_controller.author_delete_get);

// POST request to delete Author
//router.post('/author/:id/delete', author_controller.author_delete_post);

// GET request to update Author.
//router.get('/author/:id/update', author_controller.author_update_get);

// POST request to update Author.
//router.post('/author/:id/update', author_controller.author_update_post);

// GET request for one Author.
router.get('/blogger/:id', blogger_controller.blogger_detail);

// GET request for list of all Authors.
router.get('/bloggers', blogger_controller.blogger_list);


/// GENRE ROUTES ///

// GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id).
router.get('/genre/create', genre_controller.genre_create_get);

// POST request for creating Genre.
router.post('/genre/create', genre_controller.genre_create_post);

// GET request to delete Genre.
//router.get('/genre/:id/delete', genre_controller.genre_delete_get);

// POST request to delete Genre.
//router.post('/genre/:id/delete', genre_controller.genre_delete_post);

// GET request to update Genre.
//router.get('/genre/:id/update', genre_controller.genre_update_get);

// POST request to update Genre.
//router.post('/genre/:id/update', genre_controller.genre_update_post);

// GET request for one Genre.
router.get('/genre/:id', genre_controller.genre_detail);

// GET request for list of all Genre.
router.get('/genres', genre_controller.genre_list);




module.exports = router;
