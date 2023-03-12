const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notify = new Schema({
    chapname: { type: String, require: true},
    bookname: { type: String, require: true},
    bookImg: { type: String, require: true},
    booklink: { type: String, require: true},
},{
    timestamps: true,
});

module.exports = mongoose.model('notify', notify);