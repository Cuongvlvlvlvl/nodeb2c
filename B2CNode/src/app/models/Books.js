const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator')
const Schema = mongoose.Schema;

mongoose.plugin(slug);

const book = new Schema({
    email: {type: String, default: null},
    author: {type: String, default: null},
    bookname: {type: String, default: null}, 
    pic: {type:String, default: null}, 
    slug: {type:String, slug: 'bookname'}, 
},  {
    timestamps: true,
});

module.exports = mongoose.model('book', book);