const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const comment = new Schema({
    username: { type: String, require: true},
    comment: { type: String, require: true},
    bookid: { type: String, require: true},
},{
    timestamps: true,
});

module.exports = mongoose.model('comment', comment);