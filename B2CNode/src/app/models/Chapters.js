const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chapter = new Schema({
    chapname: {type: String, default: null}, 
    bookid: {type: String, default: null}, 
    imglinks: {type: Array, default: []},
    chaplink: {type: String, default: null},
    chapslug: {type: String, default: null},
    active: {type: Boolean, default: true}
},  {
    timestamps: true,
});

module.exports = mongoose.model('chapter', chapter);