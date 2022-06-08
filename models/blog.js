var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var BlogSchema=new Schema({
  title:{type: String,required:true},
  blogger:{type:Schema.ObjectId, ref:'Blogger',required:true},
  content:{type:String},
  date:{type:Date},
  genre:[{type:Schema.ObjectId, ref:'Genre' }]
});

/*
var BookSchema = new Schema({
    title: {type: String, required: true},
    author: { type: Schema.ObjectId, ref: 'Author', required: true },
    summary: {type: String, required: true},
    isbn: {type: String, required: true},
    genre: [{ type: Schema.ObjectId, ref: 'Genre' }]
});*/

// Virtual for this book instance URL.

BlogSchema
.virtual('url')
.get(function(){
  return '/catalog/blog/'+this._id;
});

/*
BookSchema
.virtual('url')
.get(function () {
  return '/catalog/book/'+this._id;
});*/

// Export model.

module.exports=mongoose.model('Blog',BlogSchema);
//module.exports = mongoose.model('Book', BookSchema);
