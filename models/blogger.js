var mongoose = require('mongoose');
const { DateTime } = require("luxon");  //for date handling

var Schema = mongoose.Schema;

var BloggerSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  date_of_birth: { type: Date },
});

// Virtual for author "full" name.
BloggerSchema.virtual('name').get(function() {
  return this.family_name + ', ' + this.first_name;
});

// Virtual for this author instance URL.
BloggerSchema.virtual('url').get(function() {
  return '/catalog/blogger/' + this._id;
});



BloggerSchema.virtual('date_of_birth_yyyy_mm_dd').get(function() {
  return DateTime.fromJSDate(this.date_of_birth).toISODate(); //format 'YYYY-MM-DD'
});



// Export model.
module.exports = mongoose.model('Blogger', BloggerSchema);

