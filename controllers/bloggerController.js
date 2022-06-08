var Blogger = require('../models/blogger')
var async = require('async')
var Blog = require('../models/blog')

const { body,validationResult } = require("express-validator");

// Display list of all Bloggers.
exports.blogger_list = function (req, res, next) {

    Blogger.find()
        .sort([['family_name', 'ascending']])
        .exec(function (err, list_bloggers) {
            if (err) { return next(err); }
            // Successful, so render.
            res.render('blogger_list', { title: 'Blogger List', blogger_list: list_bloggers });
        })

};

// Display detail page for a specific Blogger.
exports.blogger_detail = function (req, res, next) {

    async.parallel({
        blogger: function (callback) {
            Blogger.findById(req.params.id)
                .exec(callback)
        },
        bloggers_posts: function (callback) {
            Blog.find({ 'blogger': req.params.id }, 'title content')
                .exec(callback)
        },
    }, function (err, results) {
        if (err) { return next(err); } // Error in API usage.
        if (results.blogger == null) { // No results.
            var err = new Error('Blogger not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('blogger_detail', { title: 'Blogger Detail', blogger: results.blogger, blogs: results.bloggers_posts });
    });

};

// Display Blogger create form on GET.
exports.blogger_create_get = function (req, res, next) {
    res.render('blogger_form', { title: 'Create Blogger' });
};

// Handle Blogger create on POST.
exports.blogger_create_post = [

    // Validate and sanitize fields.
    body('first_name').trim().isLength({ min: 1 }).escape().withMessage('First name must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('family_name').trim().isLength({ min: 1 }).escape().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    body('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601().toDate(),
    

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);
        
        // Create blogger object with escaped and trimmed data
        var blogger = new Blogger(
            {
                first_name: req.body.first_name,
                family_name: req.body.family_name,
                date_of_birth: req.body.date_of_birth,
                
            }
        );

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('blogger_form', { title: 'Create Blogger', blogger: blogger, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.

            // Save blogger.
            blogger.save(function (err) {
                if (err) { return next(err); }
                // Successful - redirect to new author record.
                res.redirect(blogger.url);
            });
        }
    }
];



// Display Blogger delete form on GET.
exports.author_delete_get = function (req, res, next) {

    async.parallel({
        author: function (callback) {
            Author.findById(req.params.id).exec(callback)
        },
        authors_books: function (callback) {
            Book.find({ 'author': req.params.id }).exec(callback)
        },
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.author == null) { // No results.
            res.redirect('/catalog/authors');
        }
        // Successful, so render.
        res.render('author_delete', { title: 'Delete Author', author: results.author, author_books: results.authors_books });
    });

};

// Handle Blogger delete on POST.
exports.author_delete_post = function (req, res, next) {

    async.parallel({
        author: function (callback) {
            Author.findById(req.body.authorid).exec(callback)
        },
        authors_books: function (callback) {
            Book.find({ 'author': req.body.authorid }).exec(callback)
        },
    }, function (err, results) {
        if (err) { return next(err); }
        // Success.
        if (results.authors_books.length > 0) {
            // Blogger has blogs. Render in same way as for GET route.
            res.render('author_delete', { title: 'Delete Author', author: results.author, author_books: results.authors_books });
            return;
        }
        else {
            // Blogger has no blogs. Delete object and redirect to the list of bloggers.
            Author.findByIdAndRemove(req.body.authorid, function deleteAuthor(err) {
                if (err) { return next(err); }
                // Success - go to author list.
                res.redirect('/catalog/authors')
            })

        }
    });

};

// Display Blogger update form on GET.
exports.author_update_get = function (req, res, next) {

    Author.findById(req.params.id, function (err, author) {
        if (err) { return next(err); }
        if (author == null) { // No results.
            var err = new Error('Author not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        res.render('author_form', { title: 'Update Author', author: author });

    });
};

// Handle Author update on POST.
exports.author_update_post = [

    // Validate and santize fields.
    body('first_name').trim().isLength({ min: 1 }).escape().withMessage('First name must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('family_name').trim().isLength({ min: 1 }).escape().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    body('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601().toDate(),
    body('date_of_death', 'Invalid date of death').optional({ checkFalsy: true }).isISO8601().toDate(),


    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create Blogger object with escaped and trimmed data (and the old id!)
        var author = new Author(
            {
                first_name: req.body.first_name,
                family_name: req.body.family_name,
                date_of_birth: req.body.date_of_birth,
                date_of_death: req.body.date_of_death,
                _id: req.params.id
            }
        );

        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values and error messages.
            res.render('author_form', { title: 'Update Author', author: author, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            Author.findByIdAndUpdate(req.params.id, author, {}, function (err, theauthor) {
                if (err) { return next(err); }
                // Successful - redirect to genre detail page.
                res.redirect(theauthor.url);
            });
        }
    }
];
